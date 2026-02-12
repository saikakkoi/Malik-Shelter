import { Request, Response } from 'express';
import { AnimalService } from '../services/animal.service';
import { ImageService } from '../services/image.service';

const animalService = new AnimalService();

export const createAnimal = async (req: Request, res: Response) => {
  try {
    const {
      name, species, breed, gender, age_months, weight_kg,
      bio, origin, is_sterilized, medical_summary,
      dietary_requirements, energy_level, social_compatibility,
      training_level, status
    } = req.body;

    const photosData = (req.files as Express.Multer.File[])?.map((file, index) => ({
      photo_url: ImageService.getImageUrl(file.filename),
      is_main: index === 0,
      sort_order: index
    })) || [];

    const animal = await animalService.createAnimal({
      name,
      species,
      breed,
      gender,
      age_months: parseInt(age_months),
      weight_kg: parseFloat(weight_kg),
      bio,
      origin,
      is_sterilized: is_sterilized === 'true' || is_sterilized === true,
      medical_summary,
      dietary_requirements,
      energy_level,
      social_compatibility: Array.isArray(social_compatibility)
        ? social_compatibility.join(',')
        : social_compatibility,
      training_level,
      status,
      photos: {
        create: photosData
      }
    });
    res.status(201).json(animal);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateAnimal = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      age_months, weight_kg, is_sterilized,
      id: _id, created_at, updated_at, recommendations, photos, // Exclude these
      ...otherData
    } = req.body;

    const updateData: any = { ...otherData };
    if (age_months) updateData.age_months = parseInt(age_months);
    if (weight_kg) updateData.weight_kg = parseFloat(weight_kg);
    if (is_sterilized !== undefined) updateData.is_sterilized = is_sterilized === 'true' || is_sterilized === true;
    if (Array.isArray(otherData.social_compatibility)) {
      updateData.social_compatibility = otherData.social_compatibility.join(',');
    }

    const photosData = (req.files as Express.Multer.File[])?.map((file, index) => ({
      photo_url: ImageService.getImageUrl(file.filename),
      is_main: false, // Default to false for updates, could be smarter
      sort_order: index
    })) || [];

    if (photosData.length > 0) {
      updateData.photos = {
        create: photosData
      };
    }

    const animal = await animalService.updateAnimal(id, updateData);
    res.json(animal);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const archiveAnimal = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const animal = await animalService.archiveAnimal(id);
    res.json({ message: 'Animal archived successfully', animal });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAnimal = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const animal = await animalService.getAnimalById(id);
    if (!animal) return res.status(404).json({ error: 'Animal not found' });

    // Include recommendations
    const recommendations = await animalService.getRecommendations(id);

    res.json({
      ...animal,
      recommendations
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listAnimals = async (req: Request, res: Response) => {
  try {
    const {
      page = 1, limit = 10, species, gender, breed, min_age, max_age, status
    } = req.query;

    const result = await animalService.searchAnimals(
      { species, gender, breed, min_age, max_age, status },
      { page: parseInt(page as string), limit: parseInt(limit as string) }
    );

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
