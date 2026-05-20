import type { AuditAction } from '@prisma/client';
import { prisma } from '~/server/db';
import { getClientInfo } from './session';

interface AuditOpts {
  userId?: string | null;
  action: AuditAction;
  targetModel: string;
  targetId?: string;
  before?: unknown;
  after?: unknown;
}

function toJson(value: unknown): unknown {
  return JSON.parse(
    JSON.stringify(value, (_, v) => {
      if (v && typeof v === 'object' && typeof (v as { toJSON?: () => unknown }).toJSON === 'function') {
        return (v as { toJSON: () => unknown }).toJSON();
      }
      if (typeof v === 'bigint') return v.toString();
      return v;
    }),
  );
}

export async function recordAudit(opts: AuditOpts): Promise<void> {
  const { ip, userAgent } = getClientInfo();
  try {
    await prisma.auditLog.create({
      data: {
        userId: opts.userId ?? null,
        action: opts.action,
        targetModel: opts.targetModel,
        targetId: opts.targetId,
        perubahanLama: opts.before === undefined ? undefined : (toJson(opts.before) as never),
        perubahanBaru: opts.after === undefined ? undefined : (toJson(opts.after) as never),
        ipAddress: ip ?? undefined,
        userAgent: userAgent ?? undefined,
      },
    });
  } catch (err) {
    console.error('[audit] failed to record log:', err);
  }
}
