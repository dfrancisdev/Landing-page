// --- Function to get URL parameter ---
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// --- Function to populate page content ---
async function populatePage() {
    const productId = getUrlParameter('product'); // Get product ID from URL
    let productData = null;

    try {
        const response = await fetch('products.json'); // Fetch product data
        const products = await response.json();

        if (productId) {
            // Find the specific product by ID
            productData = products.find(p => p.id === productId);
        }

        // If no specific product ID or ID not found, use the first product as default
        if (!productData && products.length > 0) {
            productData = products[0];
            console.warn("Product ID not found or not provided. Displaying default product.");
        } else if (!productData) {
            // No products found in JSON or empty file
            document.body.innerHTML = "<h1>Error: No product data found.</h1><p>Please check products.json.</p>";
            return;
        }

        // Update HTML elements with product data
        document.getElementById('pageTitle').textContent = productData.subtitle;
        document.getElementById('productTitle').textContent = productData.title;
        document.getElementById('productSubtitle').textContent = productData.subtitle;
        document.getElementById('productDescription').textContent = productData.description;
        document.getElementById('downloadButton').textContent = productData.buttonText;
        document.getElementById('downloadButton').onclick = () => {
            window.location.href = productData.affiliateLink; // Redirect to affiliate link
        };
        document.getElementById('heroSection').style.backgroundImage = `url('${productData.heroImage}')`;


        // Populate features list
        const featuresList = document.getElementById('featuresList');
        featuresList.innerHTML = ''; // Clear existing list items
        productData.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });

    } catch (error) {
        console.error('Error loading or parsing product data:', error);
        document.body.innerHTML = "<h1>Error loading content.</h1><p>Please check console for details.</p>";
    }
}




// --- Call populatePage when the page loads ---
document.addEventListener('DOMContentLoaded', populatePage);