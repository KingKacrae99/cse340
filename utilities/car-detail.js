async function buildCarDetails (data) {
    let container = "";
    
    if (data) {
        // Safe Pricing Parser Fallback
        const formattedPrice = typeof addCommasAndCurrency === "function" 
            ? addCommasAndCurrency(data.inv_price) 
            : `$${Number(data.inv_price).toLocaleString()}`;

        const formattedMiles = Number(data.inv_miles).toLocaleString();

        container = `
        <section class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start antialiased text-black bg-white">
            
            <div class="lg:col-span-7 space-y-4">
                <div class="relative group aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-100 shadow-sm cursor-zoom-in" 
                     onclick="openImageModal('${data.inv_image}', '${data.inv_year} ${data.inv_make} ${data.inv_model}')">
                    
                    <img src="${data.inv_image}" alt="" class="absolute inset-0 w-full h-full object-cover opacity-30 blur-2xl scale-110 pointer-events-none">
                    
                    <img src="${data.inv_image}" 
                         alt="${data.inv_year} ${data.inv_make} ${data.inv_model}" 
                         class="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                         loading="eager">

                    <div class="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-medium flex items-center space-x-2 border border-white/10 shadow-lg">
                        <i class="fa-solid fa-magnifying-glass-plus text-[#DC2626]"></i>
                        <span>Click to expand high-res showcase</span>
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <button class="w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 border-[#DC2626] bg-neutral-900 shadow-md focus:outline-none transition-all"
                            onclick="openImageModal('${data.inv_image}', '${data.inv_year} ${data.inv_make} ${data.inv_model}')">
                        <img src="${data.inv_thumbnail}" alt="Thumbnail preview" class="w-full h-full object-cover hover:opacity-80 transition-opacity">
                    </button>
                </div>
            </div>


            <div class="lg:col-span-5 bg-black rounded-2xl p-6 lg:p-8 border border-neutral-900 shadow-2xl relative overflow-hidden text-white mb-10">
                
                <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#DC2626]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-transparent to-black pointer-events-none"></div>

                <div class="relative z-10 space-y-6">
                    <div class="border-b border-neutral-800/80 pb-5">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-neutral-900 text-neutral-400 border border-neutral-800 uppercase tracking-widest mb-3">
                            Class Configuration Unit
                        </span>
                        <h1 class="text-3xl lg:text-4xl font-black tracking-tight uppercase text-white">
                            ${data.inv_make} <span class="text-neutral-400 font-light">${data.inv_model}</span>
                        </h1>
                        <p class="text-[11px] text-gray-500 font-mono mt-1.5 tracking-wider">REF ID: ${data.inv_id} // ${data.inv_year} MANUFACTURING RUN</p>
                    </div>

                    <div class="bg-neutral-900/60 backdrop-blur-md p-4 rounded-xl border border-white/5 flex items-center justify-between shadow-inner">
                        <div>
                            <p class="text-[9px] font-bold uppercase text-gray-500 tracking-widest">Showroom Value Tag</p>
                            <p class="text-3xl font-black text-white tracking-tight">${formattedPrice}</p>
                        </div>
                        <span class="px-2.5 py-1 bg-[#DC2626] text-white rounded text-[10px] font-black uppercase tracking-wider shadow">MSRP</span>
                    </div>

                    <div class="space-y-2">
                        <h3 class="text-[10px] font-bold uppercase text-gray-500 tracking-widest pl-1">Mechanical Indexes</h3>
                        <div class="bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden divide-y divide-neutral-900">
                            
                            <div class="flex justify-between items-center px-4 py-3 text-sm transition-colors hover:bg-white/5">
                                <span class="font-medium text-gray-400"><i class="fa-solid fa-gauge text-gray-500 mr-2.5 w-4 text-center"></i>Odometer Log</span>
                                <span class="font-bold text-white font-mono">${formattedMiles} mi</span>
                            </div>

                            <div class="flex justify-between items-center px-4 py-3 text-sm transition-colors hover:bg-white/5">
                                <span class="font-medium text-gray-400"><i class="fa-solid fa-palette text-gray-500 mr-2.5 w-4 text-center"></i>Exterior Code</span>
                                <span class="font-bold text-white flex items-center space-x-2">
                                    <span class="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm" style="background-color: ${data.inv_color.toLowerCase()};"></span>
                                    <span class="capitalize">${data.inv_color}</span>
                                </span>
                            </div>

                            <div class="flex justify-between items-center px-4 py-3 text-sm transition-colors hover:bg-white/5">
                                <span class="font-medium text-gray-400"><i class="fa-solid fa-shield-check text-gray-500 mr-2.5 w-4 text-center"></i>Quality Standing</span>
                                <span class="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] bg-[#DC2626]/10 px-2 py-0.5 rounded border border-[#DC2626]/20">Verified Fleet</span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <h3 class="text-[10px] font-bold uppercase text-gray-500 tracking-widest pl-1">Showroom Overview Commentary</h3>
                        <p class="text-sm text-gray-300 leading-relaxed font-normal bg-neutral-900/30 backdrop-blur-sm border border-white/5 p-4 rounded-xl shadow-inner">
                            "${data.inv_description}"
                        </p>
                    </div>

                    <div class="pt-2">
                        <button class="w-full py-4 bg-[#DC2626] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all duration-300 shadow-md hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-2 focus:ring-offset-black">
                            Initiate Purchase Engagement
                        </button>
                    </div>
                </div>
            </div>

            <div id="imageShowcaseModal" 
                 class="fixed inset-0 z-50 invisible opacity-0 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl transition-all duration-300 ease-out"
                 role="dialog" 
                 aria-modal="true"
                 onclick="closeImageModal()">
                
                <button class="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center text-xl hover:bg-[#DC2626] hover:text-white transition-all border border-white/10" 
                        onclick="closeImageModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="max-w-5xl w-full max-h-[85vh] relative rounded-2xl overflow-hidden shadow-2xl scale-95 transform transition-transform duration-300 ease-out border border-white/10 bg-neutral-950"
                     onclick="event.stopPropagation()">
                    <img id="modalTargetImg" src="${data.inv_image}" alt="${data.inv_name}" class="w-full h-full max-h-[85vh] object-contain mx-auto">
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 text-white">
                        <p id="modalTargetCaption" class="text-lg font-black uppercase tracking-tight text-white"></p>
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
                    
                    // Fire GPU animation states smoothly
                    modal.classList.remove('invisible', 'opacity-0');
                    modal.classList.add('opacity-100');
                    modal.querySelector('div').classList.remove('scale-95');
                    modal.querySelector('div').classList.add('scale-100');
                    document.body.style.overflow = 'hidden'; // Lock primary viewport scroll track
                }

                function closeImageModal() {
                    const modal = document.getElementById('imageShowcaseModal');
                    
                    modal.classList.remove('opacity-100');
                    modal.classList.add('opacity-0');
                    modal.querySelector('div').classList.remove('scale-100');
                    modal.querySelector('div').classList.add('scale-95');
                    
                    setTimeout(() => {
                        modal.classList.add('invisible');
                        document.body.style.overflow = ''; // Unfreeze viewport track execution
                    }, 300);
                }

                // Keyboard validation check layer
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') closeImageModal();
                });
            </script>

        </section>`;
    }
    
    return container;
};

module.exports = {
    buildCarDetails
}