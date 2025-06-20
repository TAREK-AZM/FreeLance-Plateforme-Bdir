package org.example.serviceplatform.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;
import org.example.serviceplatform.Entities.Enums.StatutOffre;

import java.time.LocalDateTime;

@Data
@Builder
public class OffreDTO {
    private Integer id;
    private String title;
    private String description;
    private float prix;
    private LocalDateTime dateCreation;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateExpiration;
    private String ville;
    private StatutOffre status;
    private String image;

}