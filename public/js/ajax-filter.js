/**
 * NATIVE DOM AJAX FILTER ENGINE
 * Location: public/js/ajax-filter.js
 */
document.addEventListener("DOMContentLoaded", () => {
    // Target explicitly via the element ID tag added to the form structure
    const filterForm = document.getElementById("luxury-filter-deck");
    const gridContainer = document.getElementById("car-grid-container");
    const counterText = document.getElementById("results-counter");

    // Defensive Check: Only run the event bindings if we are actually on the catalog page
    if (!filterForm) return;

    filterForm.addEventListener("submit", async (e) => {
        // CRITICAL: Stop the native browser window reload submission action instantly
        e.preventDefault(); 
        
        const formData = new FormData(filterForm);
        const params = new URLSearchParams(formData).toString();
        
        try {
            if (gridContainer) gridContainer.style.opacity = "0.4";
            
            // Execute request to your filtration backend endpoint
            const response = await fetch(`/inv/filter?${params}`, {
                headers: { "X-Requested-With": "XMLHttpRequest" }
            });
            
            if (!response.ok) throw new Error("Network query response matrix degraded.");
            const dataset = await response.json();
            
            // Update UI match metrics counter
            if (counterText) {
                counterText.innerText = `${dataset.length} Records Match Criteria Matrix`;
            }
            
            if (!gridContainer) return;

            // Re-render the grid based on data payloads
            if (dataset.length > 0) {
                let htmlInject = `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">`;
                
                dataset.forEach(car => {
                    const formattedPrice = Number(car.inv_price).toLocaleString();
                    const formattedMiles = Number(car.inv_miles).toLocaleString();
                    const fuelBadge = car.classification_name === 'Electric' ? car.classification_name : 'Petrol Hybrid';

                    htmlInject += `
                        <article class="group bg-white border border-neutral-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between">
                            <div class="relative aspect-[16/10] bg-neutral-950 overflow-hidden border-b border-neutral-100">
                                <img src="${car.inv_image}" alt="" class="absolute inset-0 w-full h-full object-cover opacity-15 blur-xl scale-110 pointer-events-none transition-transform duration-500 group-hover:scale-125">
                                <img src="${car.inv_image}" alt="${car.inv_make} ${car.inv_model}" class="relative w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" loading="lazy">
                                <div class="absolute top-3 left-3 bg-black text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded shadow border border-white/5 font-mono">
                                    ${car.inv_year} RUN
                                </div>
                            </div>
                            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 class="text-base font-black text-black tracking-tight uppercase group-hover:text-[#DC2626] transition-colors duration-200 truncate">
                                        ${car.inv_make} <span class="text-neutral-500 font-light">${car.inv_model}</span>
                                    </h3>
                                    <div class="mt-2.5 grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] font-mono tracking-wider text-neutral-400 border-t border-neutral-50/80 pt-2.5">
                                        <div><i class="fa-solid fa-gauge mr-1 text-neutral-300"></i> ${formattedMiles} MI</div>
                                        <div class="text-right uppercase"><i class="fa-solid fa-palette mr-1 text-neutral-300"></i> ${car.inv_color}</div>
                                        <div><i class="fa-solid fa-charging-station mr-1 text-neutral-300"></i> ${fuelBadge}</div>
                                        <div class="text-right"><i class="fa-solid fa-gears mr-1 text-neutral-300"></i> Auto 8-Spd</div>
                                    </div>
                                </div>
                                <div class="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                                    <div>
                                        <span class="block text-[8px] font-black uppercase text-neutral-400 tracking-widest">Showroom MSRP</span>
                                        <span class="text-base font-black text-black tracking-tighter font-mono">$${formattedPrice}</span>
                                    </div>
                                    <a href="/inv/details/${car.inv_id}" class="px-3 py-2 bg-black hover:bg-[#DC2626] text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm transition-all duration-200">
                                        Explore Vehicle
                                    </a>
                                </div>
                            </div>
                        </article>`;
                });
                
                htmlInject += `</div>`;
                gridContainer.innerHTML = htmlInject;
            } else {
                gridContainer.innerHTML = `
                    <div class="text-center py-20 bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl max-w-sm mx-auto">
                        <i class="fa-solid fa-circle-nodes text-3xl text-neutral-300 mb-3 block"></i>
                        <h4 class="text-xs font-black uppercase tracking-wider text-black">Zero Matrix Matches</h4>
                        <p class="text-xs text-neutral-400 mt-1 max-w-xs px-4">Try relaxing your sidebar filter selections or change manufacturer values.</p>
                    </div>`;
            }
        } catch (error) {
            console.error("AJAX Filter Execution Failure Logs:", error);
        } finally {
            if (gridContainer) gridContainer.style.opacity = "1";
        }
    });
});