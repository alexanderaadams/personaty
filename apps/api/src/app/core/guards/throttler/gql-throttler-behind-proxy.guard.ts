import { Injectable } from '@nestjs/common';
import { GqlThrottlerGuard } from './gql-throttler.guard';

@Injectable()
export class GqlThrottlerBehindProxyGuard extends GqlThrottlerGuard {
	protected getTracker(req: Record<string, any>): string {
		return req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction to meet your own needs
	}
}
