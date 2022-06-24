import 'reflect-metadata';
import { of, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { LocalStorageService } from './data-access/services/storage.service';

export function CheckLocalStorageCache<T>(
	localStorageCacheKey: string | null = null
) {
	return function (
		target: Record<string, unknown> | any,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor
	): any {
		const localStorageService = new LocalStorageService();
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: Array<any>) {
			const id = args?.slice(0, 1).pop() ?? undefined;
			const updateLocalStorage = args?.slice(1, 2).pop() ?? false;
			const cacheKey = localStorageCacheKey + id;

			return localStorageService.getItem(cacheKey).pipe(
				switchMap((cacheValues) => {
					if (!cacheValues || updateLocalStorage)
						return originalMethod.apply(this, args);

					return of(JSON.parse(cacheValues)) as Observable<T | any>;
				})
			);
		};
		return descriptor;
	};
}
