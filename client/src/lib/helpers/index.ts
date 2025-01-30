export * from './dto';
export * from './render';
export * from './service';
export * from './calculations';

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
