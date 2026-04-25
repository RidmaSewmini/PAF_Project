package backend.Controller;

import backend.Model.FacilityModel;
import backend.service.FacilityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    @Autowired
    private ObjectMapper objectMapper;

    // GET all facilities with optional filters
    @GetMapping
    public ResponseEntity<List<FacilityModel>> getAllFacilities(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(
            facilityService.filterFacilities(type, location, minCapacity, status)
        );
    }

    // GET single facility
    @GetMapping("/{id}")
    public ResponseEntity<FacilityModel> getFacilityById(@PathVariable String id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    // POST create facility
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createFacility(
            @RequestPart("facility") String facilityJson,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            FacilityModel facility = objectMapper.readValue(facilityJson, FacilityModel.class);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(facilityService.createFacility(facility, image));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating facility: " + e.getMessage());
        }
    }

    // PUT update facility
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateFacility(
            @PathVariable String id,
            @RequestPart("facility") String facilityJson,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            FacilityModel facility = objectMapper.readValue(facilityJson, FacilityModel.class);
            return ResponseEntity.ok(facilityService.updateFacility(id, facility, image));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating facility: " + e.getMessage());
        }
    }

    // DELETE facility
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable String id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }
}