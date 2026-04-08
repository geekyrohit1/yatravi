const http = require('http');

async function fetchData(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function run() {
    try {
        console.log("Fetching counts...");
        const packagesData = await fetchData('http://localhost:5000/api/packages');
        const destinationsData = await fetchData('http://localhost:5000/api/destinations');

        const packages = Array.isArray(packagesData) ? packagesData : (packagesData.packages || []);
        const destinations = Array.isArray(destinationsData) ? destinationsData : (destinationsData.destinations || []);

        console.log(`\n--- DATABASE STATUS ---`);
        console.log(`Total Packages: ${packages.length}`);
        console.log(`Total Destinations: ${destinations.length}`);
        
        // Detailed summary
        const publishedPackages = packages.filter(p => p.status === 'published').length;
        const draftPackages = packages.length - publishedPackages;
        
        console.log(`Published Packages: ${publishedPackages}`);
        console.log(`Draft Packages: ${draftPackages}`);
    } catch (err) {
        console.error("Error fetching data:", err.message);
    }
}

run();
