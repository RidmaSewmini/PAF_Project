package backend.Controller;

import backend.Repository.SettingsRepository;
import backend.Model.Settings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/settings")
@CrossOrigin(origins = "http://localhost:3000")
public class SettingsController {

    @Autowired
    private SettingsRepository settingsRepository;

    @GetMapping
    public ResponseEntity<Settings> getSettings() {
        List<Settings> all = settingsRepository.findAll();
        if (all.isEmpty()) {
            Settings defaultSettings = new Settings();
            defaultSettings.setFooterText("CampusFlow • Your Campus, Streamlined. All rights reserved.");
            defaultSettings.setContactInfo("support@campusflow.io");
            return ResponseEntity.ok(defaultSettings);
        }
        return ResponseEntity.ok(all.get(0));
    }

    @PutMapping
    public ResponseEntity<Settings> updateSettings(@RequestBody Settings settings) {
        settingsRepository.deleteAll();
        Settings saved = settingsRepository.save(settings);
        return ResponseEntity.ok(saved);
    }
}
