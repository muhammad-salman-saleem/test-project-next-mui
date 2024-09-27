import { connectToDatabase } from '../../../lib/mongodb';
import Vehicle from '../../../models/Vehicle';
import { uploadImageToStorage } from '../../../lib/storage'; 

export async function POST(req) {
  const formData = await req.formData();
  
  const carModel = formData.get('carModel');
  const price = formData.get('price');
  const phone = formData.get('phone');
  const city = formData.get('city');
  const maxPictures = formData.get('maxPictures');
  
  let pictureUrls = [];

  for (let i = 0; i < maxPictures; i++) {
    const picture = formData.get(`picture_${i}`);
    if (picture) {
      const url = await uploadImageToStorage(picture); 
      pictureUrls.push(url);
    }
  }

  try {
    await connectToDatabase();
    
    const newVehicle = await Vehicle.create({
      carModel,
      price,
      phone,
      city,
      pictureUrls,
    });

    return new Response(JSON.stringify({ success: true, data: newVehicle }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
