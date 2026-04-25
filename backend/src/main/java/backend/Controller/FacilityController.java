package backend.Controller;

import backend.Model.FacilityModel;
import backend.service.FacilityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

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
    @PostMapping
    public ResponseEntity<FacilityModel> createFacility(
            @Valid @RequestBody FacilityModel facility) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(facilityService.createFacility(facility));
    }

    // PUT update facility
    @PutMapping("/{id}")
    public ResponseEntity<FacilityModel> updateFacility(
            @PathVariable String id,
            @Valid @RequestBody FacilityModel facility) {
        return ResponseEntity.ok(facilityService.updateFacility(id, facility));
    }

    // DELETE facility
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable String id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }
}