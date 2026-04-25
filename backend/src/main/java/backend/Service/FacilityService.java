package backend.service;

import backend.Model.FacilityModel;
import backend.Repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    public List<FacilityModel> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public FacilityModel getFacilityById(String id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
    }

    public FacilityModel createFacility(FacilityModel facility, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Files.copy(image.getInputStream(), uploadPath.resolve(filename));
            facility.setImageUrl(filename);
        }
        return facilityRepository.save(facility);
    }

    public FacilityModel updateFacility(String id, FacilityModel updatedFacility, MultipartFile image) throws IOException {
        FacilityModel existing = getFacilityById(id);
        existing.setName(updatedFacility.getName());
        existing.setType(updatedFacility.getType());
        existing.setLocation(updatedFacility.getLocation());
        existing.setCapacity(updatedFacility.getCapacity());
        existing.setStatus(updatedFacility.getStatus());
        existing.setAvailabilityWindows(updatedFacility.getAvailabilityWindows());
        existing.setDescription(updatedFacility.getDescription());
        if (image != null && !image.isEmpty()) {
            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Files.copy(image.getInputStream(), uploadPath.resolve(filename));
            existing.setImageUrl(filename);
        }
        return facilityRepository.save(existing);
    }

    public void deleteFacility(String id) {
        getFacilityById(id);
        facilityRepository.deleteById(id);
    }

    public List<FacilityModel> filterFacilities(String type, String location,
                                                 Integer minCapacity, String status, String name) {
        if (name != null && !name.isEmpty()) {
            return facilityRepository.findByNameContainingIgnoreCase(name);
        } else if (type != null && location != null) {
            return facilityRepository.findByTypeAndLocation(type, location);
        } else if (type != null) {
            return facilityRepository.findByType(type);
        } else if (location != null) {
            return facilityRepository.findByLocation(location);
        } else if (minCapacity != null) {
            return facilityRepository.findByCapacityGreaterThanEqual(minCapacity);
        } else if (status != null) {
            return facilityRepository.findByStatus(status);
        }
        return facilityRepository.findAll();
    }
}