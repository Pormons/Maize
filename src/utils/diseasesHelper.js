export const diseases = [
  {
    label: "Common Corn Rust",
    cause: [
      "Fungal pathogen Puccinia sorghi",
      "Cool temperatures (60-70°F)",
      "High humidity",
      "Frequent rain or heavy dew",
    ],
    symptoms: [
      "Small circular to elongated brown pustules on leaves",
      "Pustules appear on both upper and lower leaf surfaces",
      "Light-green to yellow halos around pustules",
      "Pustules turn dark brown to black as they mature",
    ],
    treatment: {
      steps: [
        "Apply foliar fungicides",
        "Use triazole fungicides",
        "Treat when disease is first detected",
      ],
      description:
        "Treatment for Common Corn Rust should begin immediately upon detection of the first symptoms. Foliar fungicides, particularly triazole-based products, are highly effective when applied early in the disease cycle. For optimal results, fungicides should be applied when rust pustules first appear on the leaves, typically before they cover more than 1% of the leaf surface. Multiple applications may be necessary if disease pressure remains high throughout the growing season.",
    },
    prevention: {
      steps: [
        "Plant resistant hybrids",
        "Maintain good air circulation",
        "Avoid overhead irrigation",
        "Regular crop rotation",
      ],
      description:
        "Prevention of Common Corn Rust begins with selecting disease-resistant corn hybrids suitable for your region. Proper field management practices are crucial, including maintaining adequate spacing between plants to ensure good air circulation. Avoid overhead irrigation or irrigate early in the day to allow leaves to dry quickly. Implementing a regular crop rotation schedule with non-host crops helps break the disease cycle and reduce the buildup of fungal spores in the field.",
    },
  },
  {
    label: "Northern Leaf Blight",
    cause: [
      "Fungal pathogen Exserohilum turcicum",
      "Moderate temperatures (64-81°F)",
      "Extended periods of leaf wetness",
      "High humidity",
    ],
    symptoms: [
      "Long, elliptical gray-green lesions",
      "Lesions begin on lower leaves",
      "Cigar-shaped lesions",
      "Lesions turn tan to brown",
    ],
    treatment: {
      steps: [
        "Apply systemic fungicides",
        "Use protective fungicides",
        "Treat at early signs of infection",
      ],
      description:
        "Treatment of Northern Leaf Blight requires a combination of systemic and protective fungicides applied at the first sign of infection. Early detection and prompt fungicide application are crucial for effective control. Systemic fungicides work by moving through the plant tissue to protect new growth, while protective fungicides create a barrier on leaf surfaces. Applications should be timed just before or at the early stages of disease development, typically around the tasseling stage, for maximum effectiveness.",
    },
    prevention: {
      steps: [
        "Use resistant hybrids",
        "Implement crop rotation",
        "Deep plow crop residue",
        "Maintain balanced soil fertility",
      ],
      description:
        "Preventing Northern Leaf Blight requires an integrated approach starting with the selection of resistant corn hybrids. A minimum two-year crop rotation away from corn helps reduce disease pressure by allowing infected residue to decompose. Deep plowing of crop residue is recommended as the pathogen can survive in corn debris. Maintaining proper soil fertility, especially nitrogen levels, helps plants better resist infection. Regular field scouting, particularly during periods of high humidity, allows for early detection and intervention.",
    },
  },
  {
    label: "Gray Leaf Spot",
    cause: [
      "Fungal pathogen Cercospora zeae-maydis",
      "Warm temperatures (75-85°F)",
      "High humidity (>90%)",
      "Extended periods of leaf wetness",
    ],
    symptoms: [
      "Small, pinpoint lesions with yellow halos",
      "Rectangular shape bounded by leaf veins",
      "Gray to tan coloration",
      "Lesions parallel to leaf veins",
    ],
    treatment: {
      steps: [
        "Apply strobilurin fungicides",
        "Use DMI fungicides",
        "Treat before disease reaches upper leaves",
      ],
      description:
        "Treatment for Gray Leaf Spot focuses on protecting the upper canopy leaves which contribute most to yield. Fungicide applications should be made preventatively or at the very early stages of disease development. Strobilurin fungicides and DMI (demethylation inhibitor) fungicides are most effective when applied before the disease reaches the upper leaves. The timing of application is critical, typically around tasseling stage or VT growth stage, as protecting the ear leaf and leaves above it is essential for maintaining yield potential.",
    },
    prevention: {
      steps: [
        "Plant resistant hybrids",
        "Rotate crops for at least 2 years",
        "Manage crop residue",
        "Maintain proper plant spacing",
      ],
      description:
        "Prevention of Gray Leaf Spot requires a comprehensive management strategy. Start by selecting resistant hybrids adapted to your area. A minimum two-year rotation away from corn is crucial as the fungus can survive in corn residue. In high-risk areas, tillage practices that bury crop residue can significantly reduce disease pressure. Proper plant spacing and row orientation can improve air circulation and reduce leaf wetness duration. Regular field monitoring, especially during periods of high humidity and warm temperatures, allows for timely implementation of management practices.",
    },
  },
];

export const diseasesInfo = (detections) => {
  if (!detections || detections.length === 0) return [];

  // Extract unique labels from the detections
  const uniqueLabels = [...new Set(detections.map(item => item))];

  // Filter the diseases array to return only the diseases with matching labels
  const filteredDiseases = diseases.filter(disease => 
    uniqueLabels.includes(disease.label)
  );

  console.log('filtered', filteredDiseases)
  return filteredDiseases;
};
