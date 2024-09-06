import { createClient } from '@supabase/supabase-js';
import { Dirent } from 'fs';
import { copyFile, mkdir, readdir, readFile, rm } from 'fs/promises';
import { dirname, join, resolve } from 'path';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);

async function uploadAsset(file: Dirent) {
    const uploadId = crypto.randomUUID();

    const { name, path } = file;
    if (!file.isFile()) {
        return;
    }

    const fullPath: string = join(path, name);
    const uploadPath: string = fullPath.replace('out/', '');

    if (name.match(/\.(html|txt|ico)/i)?.length) {
        console.log(`${uploadId}: File should be copied: ${fullPath}`);
        const publicFolder = resolve(process.cwd(), '..', 'public');
        const newPath = resolve(publicFolder, uploadPath);
        const newDirectory = dirname(newPath);
        await mkdir(newDirectory, { recursive: true });
        console.info(`${uploadId}: Directory created: ${dirname(newPath)}.`);
        await copyFile(fullPath, newPath);
        console.info(`${uploadId}: File copied to: ${newPath}.`);
    }

    const fileContents = await readFile(fullPath);

    const { data, error } = await supabase.storage
        .from(process.env.ASSET_BUCKET || '')
        .upload(uploadPath, fileContents);
    if (error) {
        console.error(`${uploadId}: ${error.message}`);
    } else {
        console.log(
            `${uploadId}: Successfully uploaded file to ${uploadPath}.`
        );
    }
}

(async () => {
    await supabase.storage.emptyBucket(process.env.ASSET_BUCKET || '');

    const buildFiles = await readdir('out', {
        recursive: true,
        withFileTypes: true,
    });

    const railsPublicDir = resolve(process.cwd(), '..', 'public');

    const publicFiles = await readdir(railsPublicDir, {
        recursive: true,
        withFileTypes: true,
    });

    console.log('YEET');

    for (let publicFile of publicFiles) {
        const { name, path } = publicFile;
        if (name === 'robots.txt') {
            // Never delete robots.txt
            continue;
        }
        const fullPath = resolve(path, name);
        await rm(fullPath, { recursive: true, force: true });
        console.log('Removed', fullPath);
    }

    console.log('Starting upload...');

    for (let buildFile of buildFiles) {
        await uploadAsset(buildFile);
    }
})();
