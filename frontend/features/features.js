const features = [
  {icon: "fa-solid fa-map-location-dot", title: "Nearby PG Search", desc: "Find PGs close to TSEC within minutes."},
  {icon: "fa-solid fa-filter", title: "Filter Options", desc: "Sort by rent, amenities, and availability."},
  {icon: "fa-solid fa-circle-check", title: "Verified Listings", desc: "We ensure trusted and updated PG details."},
  {icon: "fa-solid fa-phone", title: "Owner Contact", desc: "Get in touch with owners directly."}
];

const featureList = document.getElementById("featureList");

features.forEach(f => {
  let card = document.createElement("div");
  card.classList.add("feature-card");
  card.innerHTML = `
    <i class="${f.icon}"></i>
    <h3>${f.title}</h3>
    <p>${f.desc}</p>
  `;
  featureList.appendChild(card);
});
