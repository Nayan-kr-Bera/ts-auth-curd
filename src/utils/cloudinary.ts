import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { config } from '../config/config';



cloudinary.config({ 
    cloud_name:config.cloud_name, 
    api_key:config.api_key,
    api_secret: config.api_secret,
});



export const uploadOnCloudnary = async (localFilePath: string) => {
    try {
        if (!localFilePath) {
            return null;
        }
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });
        return res;
    } catch (err) {
        console.log(err);
        fs.unlinkSync(localFilePath);
        return null;
    }
};

export const destroyOnCloudnary = async (cloudinaryFilePath: string) => {
    try {
        if (!cloudinaryFilePath) {
            return null;
        }
        const res = await cloudinary.uploader.destroy(cloudinaryFilePath);
        return res;
    } catch (err) {
        console.log(err);
        return null;
    }
};