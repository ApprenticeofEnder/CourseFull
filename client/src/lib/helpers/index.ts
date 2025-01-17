export * from './dto';
export * from './render';
export * from './service';

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
