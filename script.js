const savedWonders = [];

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(pageId).style.display = "block";
}

async function searchWonder() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter a world wonder.</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.title === "Not found.") {
      resultsDiv.innerHTML = "<p>No information found. Try another name.</p>";
      return;
    }

    resultsDiv.innerHTML = `
      <h2>${data.title}</h2>
      ${data.thumbnail ? `<img src="${data.thumbnail.source}" alt="${data.title}" />` : ""}
      <p>${data.extract}</p>
      <p><a href="${data.content_urls.desktop.page}" target="_blank">🔗 Learn more on Wikipedia</a></p>
    `;

    if (data.thumbnail && !savedWonders.includes(data.title)) {
      savedWonders.push(data.title);
      addToGallery(data);
    }

  } catch {
    resultsDiv.innerHTML = "<p>Error fetching data. Try again later.</p>";
  }
}

function addToGallery(data) {
  const gallery = document.getElementById("galleryGrid");

  const card = document.createElement("div");
  card.innerHTML = `
    <img src="${data.thumbnail.source}" alt="${data.title}" onclick="openModal('${data.thumbnail.source}', '${data.title}')"/>
    <p>${data.title}</p>
  `;

  gallery.appendChild(card);
}

function openModal(imageSrc, title) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const caption = document.getElementById("caption");

  modal.style.display = "block";
  modalImg.src = imageSrc;
  caption.textContent = title;
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

function showRandomFact() {
  const facts = [
    "The Great Wall of China is over 13,000 miles long.",
    "The Colosseum could hold up to 80,000 spectators.",
    "Petra is known as the Rose City.",
    "The Taj Mahal took 22 years to build.",
    "Machu Picchu was rediscovered in 1911.",
    "Chichen Itza is designed around the Mayan calendar.",
    "Christ the Redeemer stands 98 feet tall."
  ];

  const random = facts[Math.floor(Math.random() * facts.length)];
  document.getElementById("randomFact").textContent = random;
}
