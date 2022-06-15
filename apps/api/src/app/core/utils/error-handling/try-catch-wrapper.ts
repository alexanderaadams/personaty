/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { HttpException, HttpStatus } from '@nestjs/common';

export function TryCatchWrapper() {
	return function (
		target: Record<string, unknown> | any,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor
	): any {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: Array<any>): Promise<any> {
			try {
				return await originalMethod.apply(this, args);
			} catch (error) {
				throw new HttpException(
					{
						statusCode:
							error?.response?.statusCode ??
							error?.status ??
							HttpStatus.INTERNAL_SERVER_ERROR,
						message:
							error?.response?.message ??
							error?.message ??
							'Something Went Wrong',
					},
					error?.response?.error ??
						error?.status ??
						HttpStatus.INTERNAL_SERVER_ERROR
				);
			}
		};

		return descriptor;
	};
}
