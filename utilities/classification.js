export async function buildClassificationPage(data) {
    /* ***************************************************************
    * Build the luxury classification view HTML with dynamic header banner
    * ***************************************************************/
    let viewHtml = '';

    if (data && data.length > 0) {
        // Extract the category name safely from the first record
        const classificationName = data[0].classification_name || "Collection";

        // 2. MODERN RESPONSIVE CATALOG GRID CONTAINER (Omit filters, focus purely on grid spans)
        viewHtml += `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <div id="inv-display" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        `;

        // 3. VEHICLE CARD COMPONENT INTERACTION MAPPING
        data.forEach(vehicle => {
            const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(vehicle.inv_price);
            const formattedMiles = Number(vehicle.inv_miles || 0).toLocaleString();
            const fuelBadge = vehicle.classification_name === 'Electric' ? 'Full Electric' : 'Petrol Hybrid';
            
            // Check if the backend already flagged this vehicle item entity as liked by the current session user
            const currentLikeHeartIconState = vehicle.is_favorited ? `fa-solid text-[var(--secondary)]` : `fa-regular`;

            viewHtml += `
                <article class="group bg-[#0D0D0D] border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl hover:border-neutral-800 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between relative">
                    
                    <!-- Media Asset Core Frame Layer -->
                    <div class="relative aspect-[16/10] bg-neutral-950 overflow-hidden border-b border-neutral-900">
                        <img src="${vehicle.inv_image || vehicle.inv_thumbnail}" alt="" class="absolute inset-0 w-full h-full object-cover opacity-10 blur-xl scale-110 pointer-events-none transition-transform duration-500 group-hover:scale-125">
                        <img src="${vehicle.inv_image || vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" class="relative w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" loading="lazy">
                        
                        <!-- Top Left Status Badge Component Area -->
                        <div class="absolute top-3 left-3 bg-red-500/80 backdrop-blur-md text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded border border-white/5 font-mono">
                            ${vehicle.inv_year || 'NEW'} ARRIVAL
                        </div>

                        <!-- Top Right Interfacial Favorite / Love Toggle Button Component Layer -->
                        <button 
                            type="button" 
                            class="like-btn absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-md text-white rounded-full border border-white/10 shadow-lg hover:bg-black/90 hover:scale-110 active:scale-95 transition-all duration-200 z-10 cursor-pointer" 
                            data-id="${vehicle.inv_id}"
                            title="Add vehicle entity registry to curated collection portfolio"
                            aria-label="Toggle collection item bookmark state"
                        >
                            <i class="${currentLikeHeartIconState} fa-heart text-xs pointer-events-none transition-colors duration-200"></i>
                        </button>
                    </div>

                    <!-- Meta Specification Text Content Area Node -->
                    <div class="p-5 flex-1 flex flex-col justify-between space-y-5">
                        <div>
                            <h2 class="text-base font-bold text-white tracking-tight uppercase group-hover:text-neutral-300 transition-colors duration-200 truncate">
                                ${vehicle.inv_make} <span class="text-neutral-400 font-light font-sans">${vehicle.inv_model}</span>
                            </h2>
                            
                            <div class="mt-3.5 grid grid-cols-2 gap-y-2 gap-x-2 text-[10px] font-mono tracking-wider text-neutral-500 border-t border-neutral-900 pt-3.5">
                                <div class="flex items-center"><i class="fa-solid fa-gauge mr-1.5 text-neutral-700"></i> ${formattedMiles} MI</div>
                                <div class="text-right uppercase truncate"><i class="fa-solid fa-palette mr-1.5 text-neutral-700"></i> ${vehicle.inv_color || 'N/A'}</div>
                                <div class="flex items-center"><i class="fa-solid fa-charging-station mr-1.5 text-neutral-700"></i> ${fuelBadge}</div>
                                <div class="text-right"><i class="fa-solid fa-gears mr-1.5 text-neutral-700"></i> Auto 8-Spd</div>
                            </div>
                        </div>

                        <!-- Action Execution Footer Row -->
                        <div class="pt-3.5 border-t border-neutral-900 flex items-center justify-between gap-2">
                            <div>
                                <span class="block text-[7px] font-bold uppercase text-neutral-500 tracking-widest font-mono">Vault Value</span>
                                <span class="text-base font-bold text-white tracking-tighter font-mono">${formattedPrice}</span>
                            </div>
                            <a href="../inv/details/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details" class="px-3.5 py-2 bg-[var(--secondary)] hover:bg-[var(--accent)] hover:text-[var(--primary)] border border-red-500 hover:border-neutral-800 text-neutral-300 text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-md transition-all duration-300">
                                Explore Vehicle
                            </a>
                        </div>
                    </div>

                </article>
            `;
        });

        viewHtml += `
            </div>
        </div>
        `;
    } else {
        // Fallback display matrix when array returns blank
        viewHtml = `
        <div class="text-center py-32 bg-[#050505] border border-dashed border-neutral-900 rounded-2xl max-w-sm mx-auto my-12">
            <i class="fa-solid fa-circle-nodes text-3xl text-neutral-700 mb-4 block"></i>
            <h4 class="text-xs font-bold uppercase tracking-wider text-white">Zero Matrix Matches</h4>
            <p class="text-xs text-neutral-500 mt-1 max-w-xs px-4">Sorry, no matching precision vehicles are registered under this showroom category.</p>
        </div>`;
    }

    return viewHtml;
}