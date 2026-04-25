package backend.service;

import backend.Model.FacilityModel;
import backend.Repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    public List<FacilityModel> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public FacilityModel getFacilityById(String id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
    }

    public FacilityModel createFacility(FacilityModel facility) {
        return facilityRepository.save(facility);
    }

    public FacilityModel updateFacility(String id, FacilityModel updatedFacility) {
        FacilityModel existing = getFacilityById(id);
        existing.setName(updatedFacility.getName());
        existing.setType(updatedFacility.getType());
        existing.setLocation(updatedFacility.getLocation());
        existing.setCapacity(updatedFacility.getCapacity());
        existing.setStatus(updatedFacility.getStatus());
        existing.setAvailabilityWindows(updatedFacility.getAvailabilityWindows());
        existing.setDescription(updatedFacility.getDescription());
        return facilityRepository.save(existing);
    }

    public void deleteFacility(String id) {
        getFacilityById(id);
        facilityRepository.deleteById(id);
    }

    public List<FacilityModel> filterFacilities(String type, String location,
                                                 Integer minCapacity, String status) {
        if (type != null && location != null) {
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