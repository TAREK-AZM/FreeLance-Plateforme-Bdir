package org.example.serviceplatform.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String titre; // Titre du service
    @Column(length = 4000)
    private String description; // Description du service
    private Double prix; // Prix du service
    private Boolean status; // Disponibilité du service
    private String image;

    // Relation avec la table `Favoris`
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Favoris> favoris;

    // Relation avec la table `Commentaire`
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Commentaire> commentaires;

    // Relation avec la table `DemandeClient`
    @OneToMany(mappedBy = "service")
    @JsonIgnore
    private List<DemandeClient> demandes;

    // Relation avec la table `Evaluation`
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Evaluation> evaluations;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "prestataire_id", nullable = false)
    private Prestataire prestataire;
}
