import 'reflect-metadata';

export function MakeItAsync() {
	return function (
		target: Record<string, unknown> | any,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor
	): any {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: Array<any>): Promise<any> {
			return await originalMethod.apply(this, args);
		};

		return descriptor;
	};
}
