async function buildCarDetails(data) {
    let container = "";
    
    if (data) {
        // Fallback pricing handling if your helper function isn't globally scoped here
        const formattedPrice = typeof addCommasAndCurrency === "function" 
            ? addCommasAndCurrency(data.inv_price) 
            : `$${Number(data.inv_price).toLocaleString()}`;

        const formattedMiles = Number(data.inv_miles).toLocaleString();

        container = `
        <section class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start antialiased text-black bg-white">
            
            <div class="lg:col-span-7 space-y-4">
                <div class="relative group aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-100 shadow-sm cursor-zoom-in" 
                     onclick="openImageModal('${data.inv_image}', '${data.inv_year} ${data.inv_make} ${data.inv_model}')">
                    
                    <img src="/${data.inv_image}" alt="" class="absolute inset-0 w-full h-full object-cover opacity-25 blur-xl scale-110 pointer-events-none">
                    
                    <img src="/${data.inv_image}" 
                         alt="${data.inv_year} ${data.inv_make} ${data.inv_model}" 
                         class="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                         loading="eager">

                    <div class="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-medium flex items-center space-x-2 border border-white/10 shadow-lg">
                        <i class="fa-solid fa-magnifying-glass-plus text-[#DC2626]"></i>
                        <span>Click to expand 4K presentation canvas</span>
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <button class="w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 border-[#DC2626] bg-neutral-50 shadow-sm focus:outline-none transition-all"
                            onclick="openImageModal('${data.inv_image}', '${data.inv_year} ${data.inv_make} ${data.inv_model}')">
                        <img src="/${data.inv_thumbnail}" alt="Thumbnail preview" class="w-full h-full object-cover hover:opacity-80 transition-opacity">
                    </button>
                </div>
            </div>

            <div class="lg:col-span-5 space-y-6">
                <div class="border-b border-neutral-100 pb-5">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-500 uppercase tracking-wider mb-2">
                        Class #{data.classification_id} Fleet Unit
                    </span>
                    <h1 class="text-3xl lg:text-4xl font-black text-black tracking-tight uppercase">${data.inv_make} <span class="text-neutral-500 font-medium">${data.inv_model}</span></h1>
                    <p class="text-xs text-neutral-400 font-mono mt-1">VIN Reference Catalog: ID-${data.inv_id} / ${data.inv_year} Model Build</p>
                </div>

                <div class="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex items-center justify-between">
                    <div>
                        <p class="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">Valuation Tag</p>
                        <p class="text-3xl font-black text-black tracking-tight">${formattedPrice}</p>
                    </div>
                    <span class="px-3 py-1 bg-neutral-900 text-white rounded text-xs font-black uppercase tracking-wider">MSRP</span>
                </div>

                <div>
                    <h3 class="text-xs font-bold uppercase text-neutral-400 tracking-widest mb-3">Mechanical & Aesthetic Metrics</h3>
                    <div class="border border-neutral-200/60 rounded-xl overflow-hidden divide-y divide-neutral-100">
                        
                        <div class="flex justify-between items-center px-4 py-3 bg-white text-sm">
                            <span class="font-medium text-neutral-500"><i class="fa-solid fa-gauge text-neutral-400 mr-2 w-4"></i>Odometer Reading</span>
                            <span class="font-bold text-black font-mono">${formattedMiles} mi</span>
                        </div>

                        <div class="flex justify-between items-center px-4 py-3 bg-neutral-50/50 text-sm">
                            <span class="font-medium text-neutral-500"><i class="fa-solid fa-palette text-neutral-400 mr-2 w-4"></i>Exterior Paint</span>
                            <span class="font-bold text-black flex items-center space-x-2">
                                <span class="w-3 h-3 rounded-full border border-neutral-300 shadow-sm" style="background-color: ${data.inv_color.toLowerCase()};"></span>
                                <span class="capitalize">${data.inv_color}</span>
                            </span>
                        </div>

                        <div class="flex justify-between items-center px-4 py-3 bg-white text-sm">
                            <span class="font-medium text-neutral-500"><i class="fa-solid fa-shield-check text-neutral-400 mr-2 w-4"></i>Safety Validation</span>
                            <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Certified Fleet</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <h3 class="text-xs font-bold uppercase text-neutral-400 tracking-widest">Showroom Description Commentary</h3>
                    <p class="text-sm text-neutral-600 leading-relaxed font-normal bg-white border border-neutral-100 p-4 rounded-xl shadow-inner">
                        "${data.inv_description}"
                    </p>
                </div>

                <div class="pt-2">
                    <button class="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#DC2626] transition-colors duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-2">
                        Initiate Purchase Engagement
                    </button>
                </div>
            </div>

            <div id="imageShowcaseModal" 
                 class="fixed inset-0 z-50 invisible opacity-0 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl transition-all duration-300 ease-out"
                 role="dialog" 
                 aria-modal="true"
                 onclick="closeImageModal()">
                
                <button class="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center text-xl hover:bg-[#DC2626] transition-colors border border-white/10" 
                        onclick="closeImageModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="max-w-5xl w-full max-h-[85vh] relative rounded-2xl overflow-hidden shadow-2xl scale-95 transform transition-transform duration-300 ease-out border border-white/10 bg-neutral-950"
                     onclick="event.stopPropagation()">
                    <img id="modalTargetImg" src="" alt="" class="w-full h-full max-h-[85vh] object-contain mx-auto">
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 text-white">
                        <p id="modalTargetCaption" class="text-lg font-black uppercase tracking-tight"></p>
                    </div>
                </div>
            </div>

            <script>
                function openImageModal(imgSrc, captionText) {
                    const modal = document.getElementById('imageShowcaseModal');
                    const modalImg = document.getElementById('modalTargetImg');
                    const modalCaption = document.getElementById('modalTargetCaption');
                    
                    modalImg.src = imgSrc;
                    modalCaption.innerText = captionText;
                    
                    // Trigger GPU visual animation entry changes
                    modal.classList.remove('invisible', 'opacity-0');
                    modal.classList.add('opacity-100');
                    modal.querySelector('div').classList.remove('scale-95');
                    modal.querySelector('div').classList.add('scale-100');
                    document.body.style.overflow = 'hidden'; // Keep background static
                }

                function closeImageModal() {
                    const modal = document.getElementById('imageShowcaseModal');
                    
                    modal.classList.remove('opacity-100');
                    modal.classList.add('opacity-0');
                    modal.querySelector('div').classList.remove('scale-100');
                    modal.querySelector('div').classList.add('scale-95');
                    
                    setTimeout(() => {
                        modal.classList.add('invisible');
                        document.body.style.overflow = ''; // Unfreeze viewport
                    }, 300);
                }

                // Close layout safely if Escape key hits the window listener frame
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') closeImageModal();
                });
            </script>

        </section>`;
    }
    
    return container;
};

module.exports = { buildCarDetails}