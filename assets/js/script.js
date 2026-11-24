// Toggle Hamburger Menu Mobile
const burgerMenu = document.querySelector("#sugiana_burger_menu");
const navbarNav = document.querySelector("#sugiana_navbar_nav");
const siteHeader = document.querySelector("#sugiana_header");

if (burgerMenu && navbarNav) {
    burgerMenu.addEventListener("click", () => {
        navbarNav.classList.toggle("sugiana_nav_open");
        burgerMenu.classList.toggle("sugiana_burger_active");
    });

    // Tutup menu mobile otomatis saat pengguna klik di luar area navigasi
    document.addEventListener("click", (e) => {
        if (!burgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
            navbarNav.classList.remove("sugiana_nav_open");
            burgerMenu.classList.remove("sugiana_burger_active");
        }
    });
}

// Efek latar kaca halus pada navbar saat halaman di-scroll
window.addEventListener("scroll", () => {
    if (siteHeader) {
        if (window.scrollY > 25) {
            siteHeader.classList.add("sugiana_header_scrolled");
        } else {
            siteHeader.classList.remove("sugiana_header_scrolled");
        }
    }
});

// Interactive Milestone Tabs (Halaman tentang.html)
const timelineButtons = document.querySelectorAll(".sugiana_timeline_btn");
const timelinePhoto = document.querySelector("#sugiana_timeline_photo");
const timelineTag = document.querySelector("#sugiana_timeline_tag");
const timelineTitle = document.querySelector("#sugiana_timeline_title");
const timelineDesc = document.querySelector("#sugiana_timeline_desc");

const milestoneData = {
    "2024": {
        tag: "TONGGAK 2024",
        title: "Pembukaan Kedai Pertama di Jl. Pemuda",
        desc: "SEGI Coffee resmi membuka pintu pertamanya di Kota Tasikmalaya dengan kapasitas 35 kursi, mengusung konsep ruang minimalis hangat dan kurasi biji kopi tunggal asal Jawa Barat.",
        photo: "assets/image/sugiana-bg-13.jpg"
    },
    "2025": {
        tag: "TONGGAK 2025",
        title: "Pengoperasian Mesin Sangrai Mandiri",
        desc: "Memulai fasilitas small-batch roastery sendiri untuk mengontrol penuh profil sangrai setiap pekan dan memperluas kemitraan langsung dengan 13 kelompok tani kopi Priangan.",
        photo: "assets/image/sugiana-bg-20.jpg"
    },
    "2026": {
        tag: "TONGGAK 2026",
        title: "Ekspansi Slow Bar & Ruang Kolaborasi",
        desc: "Menghadirkan meja slow bar khusus seduhan manual filter, sudut kerja tenang dengan akses listrik penuh, serta layanan pemesanan digital untuk kenyamanan pelanggan.",
        photo: "assets/image/sugiana-bg-24.jpg"
    }
};

if (timelineButtons.length > 0 && timelineTitle) {
    timelineButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            timelineButtons.forEach((b) => b.classList.remove("sugiana_timeline_active"));
            btn.classList.add("sugiana_timeline_active");

            const year = btn.getAttribute("data-year");
            const item = milestoneData[year];

            if (item) {
                timelinePhoto.src = item.photo;
                timelineTag.textContent = item.tag;
                timelineTitle.textContent = item.title;
                timelineDesc.textContent = item.desc;
            }
        });
    });
}

// Interactive Menu Filter & Order Estimator (Halaman menu.html)
const catButtons = document.querySelectorAll(".sugiana_cat_btn");
const dishCards = document.querySelectorAll(".sugiana_dish_card");
const tempFilter = document.querySelector("#sugiana_temp_filter");
const menuSearch = document.querySelector("#sugiana_menu_search");
const emptyCatalog = document.querySelector("#sugiana_empty_catalog");

let currentCategory = "all";

function filterDishCatalog() {
    if (dishCards.length === 0) return;
    const selectedTemp = tempFilter ? tempFilter.value : "all";
    const keyword = menuSearch ? menuSearch.value.toLowerCase().trim() : "";
    let matchCount = 0;

    dishCards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        const cardTemp = card.getAttribute("data-temp");
        const cardTitle = card.querySelector("h3").textContent.toLowerCase();
        const cardDesc = card.querySelector("p").textContent.toLowerCase();

        const okCat = currentCategory === "all" || cardCat === currentCategory;
        const okTemp = selectedTemp === "all" || cardTemp === selectedTemp;
        const okSearch = cardTitle.includes(keyword) || cardDesc.includes(keyword);

        if (okCat && okTemp && okSearch) {
            card.style.display = "flex";
            matchCount++;
        } else {
            card.style.display = "none";
        }
    });

    if (emptyCatalog) {
        emptyCatalog.style.display = matchCount === 0 ? "block" : "none";
    }
}

catButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        catButtons.forEach((b) => b.classList.remove("sugiana_cat_active"));
        btn.classList.add("sugiana_cat_active");
        currentCategory = btn.getAttribute("data-category");
        filterDishCatalog();
    });
});

if (tempFilter) tempFilter.addEventListener("change", filterDishCatalog);
if (menuSearch) menuSearch.addEventListener("input", filterDishCatalog);

// Kalkulator Estimasi Catatan Pesanan
const addOrderButtons = document.querySelectorAll(".sugiana_add_order_btn");
const orderItemsContainer = document.querySelector("#sugiana_order_items");
const orderCountBadge = document.querySelector("#sugiana_order_count");
const orderTotalText = document.querySelector("#sugiana_order_total");
const copyOrderBtn = document.querySelector("#sugiana_copy_order");
const clearOrderBtn = document.querySelector("#sugiana_clear_order");
const copyStatusText = document.querySelector("#sugiana_copy_status");

let orderBucket = [];

function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

function renderOrderSidebar() {
    if (!orderItemsContainer) return;

    const totalItems = orderBucket.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = orderBucket.reduce((sum, item) => sum + item.price * item.qty, 0);

    orderCountBadge.textContent = totalItems + " Item";
    orderTotalText.textContent = formatRupiah(totalPrice);

    if (orderBucket.length === 0) {
        orderItemsContainer.innerHTML = `<p class="sugiana_order_empty">Belum ada menu dipilih. Klik tombol <strong>+ Tambah</strong> pada daftar menu untuk menghitung estimasi pesanan.</p>`;
        return;
    }

    orderItemsContainer.innerHTML = orderBucket.map((item, idx) => `
        <div class="sugiana_order_row">
            <div class="sugiana_order_row_info">
                <h4>${item.name}</h4>
                <span>${formatRupiah(item.price)} x ${item.qty}</span>
            </div>
            <div class="sugiana_order_qty_ctrl">
                <button type="button" class="sugiana_qty_btn" onclick="updateOrderQty(${idx}, -1)">-</button>
                <span>${item.qty}</span>
                <button type="button" class="sugiana_qty_btn" onclick="updateOrderQty(${idx}, 1)">+</button>
            </div>
        </div>
    `).join("");
}

window.updateOrderQty = function(index, delta) {
    orderBucket[index].qty += delta;
    if (orderBucket[index].qty <= 0) {
        orderBucket.splice(index, 1);
    }
    renderOrderSidebar();
};

addOrderButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        const price = parseInt(btn.getAttribute("data-price"), 10);
        const existing = orderBucket.find((item) => item.name === name);

        if (existing) {
            existing.qty += 1;
        } else {
            orderBucket.push({ name, price, qty: 1 });
        }
        renderOrderSidebar();
    });
});

if (copyOrderBtn) {
    copyOrderBtn.addEventListener("click", () => {
        if (orderBucket.length === 0) {
            copyStatusText.textContent = "Pilih minimal 1 menu terlebih dahulu.";
            return;
        }
        const summaryLines = orderBucket.map((i) => `- ${i.name} (${i.qty}x) = ${formatRupiah(i.price * i.qty)}`).join("\n");
        const total = orderBucket.reduce((sum, i) => sum + i.price * i.qty, 0);
        const finalText = `Catatan Pesanan SEGI Coffee:\n${summaryLines}\nEstimasi Total: ${formatRupiah(total)}`;

        navigator.clipboard.writeText(finalText);
        copyStatusText.textContent = "Daftar pesanan berhasil disalin ke clipboard!";
        setTimeout(() => { copyStatusText.textContent = ""; }, 2500);
    });
}

if (clearOrderBtn) {
    clearOrderBtn.addEventListener("click", () => {
        orderBucket = [];
        copyStatusText.textContent = "";
        renderOrderSidebar();
    });
}

// Interactive Gallery Filter & Lightbox Modal (Halaman galeri.html)
const galFilterBtns = document.querySelectorAll(".sugiana_gal_filter_btn");
const archiveCards = document.querySelectorAll(".sugiana_archive_card");
const galleryCountText = document.querySelector("#sugiana_gallery_count");

if (galFilterBtns.length > 0 && archiveCards.length > 0) {
    galFilterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            galFilterBtns.forEach((b) => b.classList.remove("sugiana_gal_filter_active"));
            btn.classList.add("sugiana_gal_filter_active");

            const selectedCat = btn.getAttribute("data-gal-filter");
            let visibleItems = 0;

            archiveCards.forEach((card) => {
                const cardCat = card.getAttribute("data-gal-cat");
                if (selectedCat === "all" || cardCat === selectedCat) {
                    card.style.display = "block";
                    visibleItems++;
                } else {
                    card.style.display = "none";
                }
            });

            if (galleryCountText) {
                galleryCountText.textContent = "Menampilkan " + visibleItems + " Dokumentasi";
            }
        });
    });
}

// Lightbox Preview dengan Navigasi Next/Prev
const galTriggers = Array.from(document.querySelectorAll(".sugiana_gal_trigger"));
const lightboxModal = document.querySelector("#sugiana_lightbox");
const lightboxImg = document.querySelector("#sugiana_lightbox_img");
const lightboxTag = document.querySelector("#sugiana_lightbox_tag");
const lightboxTitle = document.querySelector("#sugiana_lightbox_title");
const lightboxDesc = document.querySelector("#sugiana_lightbox_desc");
const lightboxCloseBtn = document.querySelector("#sugiana_lightbox_close");
const lightboxPrevBtn = document.querySelector("#sugiana_lightbox_prev");
const lightboxNextBtn = document.querySelector("#sugiana_lightbox_next");

let activePhotoIndex = 0;

function openLightboxAt(index) {
    if (!lightboxModal || galTriggers.length === 0) return;
    activePhotoIndex = (index + galTriggers.length) % galTriggers.length;

    const targetEl = galTriggers[activePhotoIndex];
    const imgEl = targetEl.querySelector("img");
    const catName = targetEl.getAttribute("data-gal-cat") || "galeri";
    const titleText = targetEl.getAttribute("data-gal-title") || "";
    const descText = targetEl.getAttribute("data-gal-desc") || "";

    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt;
    lightboxTag.textContent = "KATEGORI: " + catName.toUpperCase();
    lightboxTitle.textContent = titleText;
    lightboxDesc.textContent = descText;
    lightboxModal.classList.add("sugiana_lightbox_open");
}

if (galTriggers.length > 0 && lightboxModal) {
    galTriggers.forEach((el, idx) => {
        el.addEventListener("click", () => openLightboxAt(idx));
    });

    lightboxCloseBtn.addEventListener("click", () => {
        lightboxModal.classList.remove("sugiana_lightbox_open");
    });

    lightboxPrevBtn.addEventListener("click", () => openLightboxAt(activePhotoIndex - 1));
    lightboxNextBtn.addEventListener("click", () => openLightboxAt(activePhotoIndex + 1));

    lightboxModal.addEventListener("click", (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.remove("sugiana_lightbox_open");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (!lightboxModal.classList.contains("sugiana_lightbox_open")) return;
        if (e.key === "Escape") lightboxModal.classList.remove("sugiana_lightbox_open");
        if (e.key === "ArrowLeft") openLightboxAt(activePhotoIndex - 1);
        if (e.key === "ArrowRight") openLightboxAt(activePhotoIndex + 1);
    });
}

// Interactive Testimonials Filter, Helpful Toggle & Live Submission (Halaman testimoni.html)
const testiTabBtns = document.querySelectorAll(".sugiana_testi_tab_btn");
const masonryWall = document.querySelector("#sugiana_masonry_wall");
const testiTotalLabel = document.querySelector("#sugiana_testi_total_label");

function updateTestiCount() {
    if (!masonryWall || !testiTotalLabel) return;
    const allCards = masonryWall.querySelectorAll(".sugiana_wall_card");
    let visibleCount = 0;
    allCards.forEach((c) => {
        if (c.style.display !== "none") visibleCount++;
    });
    testiTotalLabel.textContent = "Menampilkan " + visibleCount + " Ulasan";
}

if (testiTabBtns.length > 0 && masonryWall) {
    testiTabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            testiTabBtns.forEach((b) => b.classList.remove("sugiana_testi_tab_active"));
            btn.classList.add("sugiana_testi_tab_active");

            const filterCat = btn.getAttribute("data-testi-cat");
            const cards = masonryWall.querySelectorAll(".sugiana_wall_card");

            cards.forEach((card) => {
                const cardCat = card.getAttribute("data-testi-cat");
                if (filterCat === "all" || cardCat === filterCat) {
                    card.style.display = "inline-block";
                } else {
                    card.style.display = "none";
                }
            });
            updateTestiCount();
        });
    });
}

// Tombol "Membantu" (Helpful Counter)
document.addEventListener("click", (e) => {
    const helpfulBtn = e.target.closest(".sugiana_helpful_btn");
    if (!helpfulBtn) return;

    let currentCount = parseInt(helpfulBtn.getAttribute("data-count"), 10) || 0;
    const isLiked = helpfulBtn.classList.toggle("sugiana_helpful_active");
    currentCount = isLiked ? currentCount + 1 : currentCount - 1;

    helpfulBtn.setAttribute("data-count", currentCount);
    helpfulBtn.querySelector("span").textContent = currentCount;
});

// Pemilih Rating Bintang & Kirim Ulasan Baru
const starPicker = document.querySelector("#sugiana_star_picker");
const starPickBtns = document.querySelectorAll(".sugiana_star_pick_btn");
const testiForm = document.querySelector("#sugiana_testi_form");
const testiFeedback = document.querySelector("#sugiana_testi_feedback");

if (starPicker && starPickBtns.length > 0) {
    starPickBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const val = parseInt(btn.getAttribute("data-val"), 10);
            starPicker.setAttribute("data-selected", val);

            starPickBtns.forEach((sBtn) => {
                const sVal = parseInt(sBtn.getAttribute("data-val"), 10);
                sBtn.classList.toggle("sugiana_star_selected", sVal <= val);
            });
        });
    });
}

if (testiForm && masonryWall) {
    testiForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nama = document.querySelector("#sugiana_rev_name").value.trim();
        const role = document.querySelector("#sugiana_rev_role").value.trim() || "Pelanggan SEGI";
        const catVal = document.querySelector("#sugiana_rev_category").value;
        const comment = document.querySelector("#sugiana_rev_comment").value.trim();
        const starCount = starPicker ? parseInt(starPicker.getAttribute("data-selected"), 10) : 5;

        const catLabels = {
            kopi: "Kopi & Menu",
            suasana: "Suasana Kerja",
            pelayanan: "Pelayanan Bar"
        };

        let starsHTML = "";
        for (let i = 0; i < starCount; i++) {
            starsHTML += `<i data-lucide="star"></i>`;
        }

        const newCard = document.createElement("article");
        newCard.className = "sugiana_wall_card";
        newCard.setAttribute("data-testi-cat", catVal);
        newCard.innerHTML = `
            <div class="sugiana_wall_card_top">
                <div class="sugiana_wall_stars">${starsHTML}</div>
                <span class="sugiana_wall_cat">${catLabels[catVal] || "Ulasan Tamu"}</span>
            </div>
            <p class="sugiana_wall_quote">"${comment}"</p>
            <div class="sugiana_wall_footer">
                <div class="sugiana_wall_user">
                    <img src="assets/image/sugiana-profile-8.jpg" alt="${nama}">
                    <div>
                        <h4>${nama}</h4>
                        <span>${role}</span>
                    </div>
                </div>
                <button type="button" class="sugiana_helpful_btn" data-count="1">
                    <i data-lucide="thumbs-up"></i>
                    <span>1</span>
                </button>
            </div>
        `;

        masonryWall.prepend(newCard);
        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
        updateTestiCount();

        testiFeedback.textContent = "Terima kasih, " + nama + "! Ulasan Anda berhasil ditambahkan ke dinding testimoni.";
        testiFeedback.classList.add("sugiana_testi_feedback_show");
        testiForm.reset();
    });
}

// Interactive Promo Countdown, Copy Code, Simulator & FAQ (Halaman promo.html)
const cdHoursEl = document.querySelector("#sugiana_cd_hours");
const cdMinsEl = document.querySelector("#sugiana_cd_mins");
const cdSecsEl = document.querySelector("#sugiana_cd_secs");

if (cdHoursEl && cdMinsEl && cdSecsEl) {
    let remainingSeconds = 6 * 3600 + 45 * 60 + 30;
    setInterval(() => {
        if (remainingSeconds <= 0) return;
        remainingSeconds -= 1;
        const hrs = Math.floor(remainingSeconds / 3600);
        const mins = Math.floor((remainingSeconds % 3600) / 60);
        const secs = remainingSeconds % 60;

        cdHoursEl.textContent = String(hrs).padStart(2, "0");
        cdMinsEl.textContent = String(mins).padStart(2, "0");
        cdSecsEl.textContent = String(secs).padStart(2, "0");
    }, 1000);
}

// Filter Kategori Voucher
const promoTabBtns = document.querySelectorAll(".sugiana_promo_tab_btn");
const voucherCards = document.querySelectorAll(".sugiana_voucher_card");

if (promoTabBtns.length > 0 && voucherCards.length > 0) {
    promoTabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            promoTabBtns.forEach((b) => b.classList.remove("sugiana_promo_tab_active"));
            btn.classList.add("sugiana_promo_tab_active");

            const cat = btn.getAttribute("data-promo-cat");
            voucherCards.forEach((card) => {
                const cardCat = card.getAttribute("data-promo-cat");
                card.style.display = (cat === "all" || cardCat === cat) ? "flex" : "none";
            });
        });
    });
}

// Salin Kode Voucher Satu Klik
const copyCodeBtns = document.querySelectorAll(".sugiana_copy_code_btn");
const promoToast = document.querySelector("#sugiana_promo_toast");
const simCodeInput = document.querySelector("#sugiana_sim_code");

if (copyCodeBtns.length > 0) {
    copyCodeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const code = btn.getAttribute("data-code");
            if (navigator.clipboard) {
                navigator.clipboard.writeText(code).catch(() => {});
            }

            if (simCodeInput) {
                simCodeInput.value = code;
            }

            const labelSpan = btn.querySelector("span");
            const originalLabel = labelSpan ? labelSpan.textContent : "Salin";
            if (labelSpan) labelSpan.textContent = "Tersalin!";
            btn.classList.add("sugiana_copied_done");

            if (promoToast) {
                promoToast.textContent = "Kode " + code + " berhasil disalin! Tunjukkan saat transaksi di kasir.";
            }

            setTimeout(() => {
                if (labelSpan) labelSpan.textContent = originalLabel;
                btn.classList.remove("sugiana_copied_done");
            }, 2000);
        });
    });
}

// Simulasi Potongan Voucher
const simBundleSelect = document.querySelector("#sugiana_sim_bundle");
const applySimBtn = document.querySelector("#sugiana_apply_sim_btn");
const simNormalEl = document.querySelector("#sugiana_sim_normal");
const simAppliedLabel = document.querySelector("#sugiana_sim_applied_label");
const simSavedEl = document.querySelector("#sugiana_sim_saved");
const simFinalEl = document.querySelector("#sugiana_sim_final");
const simNoteEl = document.querySelector("#sugiana_sim_note");

const promoRules = {
    SEGIPAGI25: { type: "percent", val: 25, desc: "potongan 25% berhasil diterapkan." },
    DUOSEGI12: { type: "flat", val: 12000, desc: "potongan langsung Rp 12.000 berhasil diterapkan." },
    SLOWBAR20: { type: "percent", val: 20, desc: "potongan 20% Slow Bar berhasil diterapkan." },
    ROASTWEEK15: { type: "percent", val: 15, desc: "potongan 15% pembelian roasted beans diterapkan." },
    SEGIOATFREE: { type: "flat", val: 6000, desc: "gratis upgrade Oat Milk (hemat Rp 6.000) diterapkan." },
    MATCHAPAIR: { type: "flat", val: 11000, desc: "harga spesial bundling Matcha & Croissant diterapkan." },
    SEGIKAMPUS: { type: "percent", val: 15, desc: "diskon mahasiswa 15% berhasil diterapkan." }
};

function runPromoSimulation() {
    if (!simBundleSelect || !simCodeInput) return;
    const basePrice = parseInt(simBundleSelect.value, 10) || 0;
    const enteredCode = simCodeInput.value.toUpperCase().trim();
    const rule = promoRules[enteredCode];

    let discountAmount = 0;
    if (rule) {
        discountAmount = rule.type === "percent"
            ? Math.round((basePrice * rule.val) / 100)
            : Math.min(basePrice, rule.val);
        simAppliedLabel.textContent = enteredCode;
        simNoteEl.textContent = "Kode " + enteredCode + " aktif: " + rule.desc;
    } else {
        simAppliedLabel.textContent = enteredCode || "TIDAK ADA";
        simNoteEl.textContent = "Kode tidak dikenali. Coba gunakan SEGIPAGI25, DUOSEGI12, atau SLOWBAR20.";
    }

    const finalPrice = basePrice - discountAmount;
    simNormalEl.textContent = "Rp " + basePrice.toLocaleString("id-ID");
    simSavedEl.textContent = "- Rp " + discountAmount.toLocaleString("id-ID");
    simFinalEl.textContent = "Rp " + finalPrice.toLocaleString("id-ID");
}

if (applySimBtn && simBundleSelect) {
    applySimBtn.addEventListener("click", runPromoSimulation);
    simBundleSelect.addEventListener("change", runPromoSimulation);
}

// FAQ Accordion
const faqItems = document.querySelectorAll(".sugiana_faq_item");
if (faqItems.length > 0) {
    faqItems.forEach((item) => {
        const qBtn = item.querySelector(".sugiana_faq_question");
        qBtn.addEventListener("click", () => {
            item.classList.toggle("sugiana_faq_open");
        });
    });
}

// Interactive Contact, Zone Preview & Reservation Hub (Halaman kontak.html)
const statusPill = document.querySelector("#sugiana_status_pill");
const statusText = document.querySelector("#sugiana_status_text");

if (statusPill && statusText) {
    const currentHour = new Date().getHours();
    if (currentHour >= 8 && currentHour < 22) {
        statusPill.classList.remove("sugiana_status_closed");
        statusText.textContent = "Sedang Buka • Melayani hingga 22.00 WIB";
    } else {
        statusPill.classList.add("sugiana_status_closed");
        statusText.textContent = "Tutup Sementara • Buka Kembali Pukul 08.00 WIB";
    }
}

// Eksplorasi Zona Duduk & Sinkronisasi ke Form Reservasi
const zoneButtons = document.querySelectorAll(".sugiana_zone_btn");
const zoneImg = document.querySelector("#sugiana_zone_img");
const zoneTitle = document.querySelector("#sugiana_zone_title");
const zoneDesc = document.querySelector("#sugiana_zone_desc");
const zoneAmenities = document.querySelector("#sugiana_zone_amenities");
const resZoneSelect = document.querySelector("#sugiana_res_zone");

const zoneCatalog = {
    komunal: {
        title: "Meja Komunal & Ruang Kerja",
        selectVal: "Meja Komunal & Ruang Kerja",
        desc: "Area dalam ruangan ber-AC dengan pencahayaan alami hangat, meja kayu luas untuk laptop, serta akses stopkontak di setiap sisi kursi.",
        img: "assets/image/sugiana-bg-24.jpg",
        tags: ["2 – 8 Orang", "Full Stopkontak", "Wi-Fi 150 Mbps"]
    },
    slowbar: {
        title: "Slow Bar & Espresso Counter",
        selectVal: "Slow Bar & Espresso Counter",
        desc: "Duduk berhadapan langsung dengan meja seduh manual untuk berdiskusi seputar karakter biji kopi bersama barista kami.",
        img: "assets/image/sugiana-bg-13.jpg",
        tags: ["1 – 3 Orang", "Interaksi Barista", "Manual Brew"]
    },
    teras: {
        title: "Teras Cahaya Pagi (Semi-Outdoor)",
        selectVal: "Teras Cahaya Pagi (Semi-Outdoor)",
        desc: "Sudut semi-terbuka dengan sirkulasi udara segar dan tanaman hijau, cocok untuk obrolan sore maupun bersantai.",
        img: "assets/image/sugiana-bg-11.jpg",
        tags: ["2 – 6 Orang", "Semi-Outdoor", "Suasana Santai"]
    }
};

if (zoneButtons.length > 0 && zoneTitle) {
    zoneButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            zoneButtons.forEach((b) => b.classList.remove("sugiana_zone_active"));
            btn.classList.add("sugiana_zone_active");

            const key = btn.getAttribute("data-zone");
            const data = zoneCatalog[key];
            if (!data) return;

            zoneImg.src = data.img;
            zoneTitle.textContent = data.title;
            zoneDesc.textContent = data.desc;
            zoneAmenities.innerHTML = data.tags
                .map((tag) => `<span class="sugiana_amenity_badge">${tag}</span>`)
                .join("");

            if (resZoneSelect) {
                resZoneSelect.value = data.selectVal;
            }
        });
    });
}

// Switch Mode Form: Reservasi Meja vs Pesan & Kolaborasi
const modeButtons = document.querySelectorAll(".sugiana_mode_btn");
const reservasiFields = document.querySelector("#sugiana_reservasi_fields");
const pesanFields = document.querySelector("#sugiana_pesan_fields");
const ctSubmitBtn = document.querySelector("#sugiana_ct_submit_btn");
let activeContactMode = "reservasi";

if (modeButtons.length > 0 && reservasiFields && pesanFields) {
    modeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            modeButtons.forEach((b) => b.classList.remove("sugiana_mode_active"));
            btn.classList.add("sugiana_mode_active");

            activeContactMode = btn.getAttribute("data-mode");
            if (activeContactMode === "reservasi") {
                reservasiFields.classList.remove("sugiana_hidden_group");
                pesanFields.classList.add("sugiana_hidden_group");
                ctSubmitBtn.querySelector("span").textContent = "Konfirmasi Reservasi Meja";
            } else {
                reservasiFields.classList.add("sugiana_hidden_group");
                pesanFields.classList.remove("sugiana_hidden_group");
                ctSubmitBtn.querySelector("span").textContent = "Kirim Pesan Sekarang";
            }
        });
    });
}

// Pemilih Jam Kedatangan (Slot Pills)
const slotButtons = document.querySelectorAll(".sugiana_slot_btn");
let selectedTimeSlot = "09:00 WIB";

if (slotButtons.length > 0) {
    slotButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            slotButtons.forEach((b) => b.classList.remove("sugiana_slot_active"));
            btn.classList.add("sugiana_slot_active");
            selectedTimeSlot = btn.getAttribute("data-slot");
        });
    });
}

// Set default tanggal besok pada input tanggal reservasi
const resDateInput = document.querySelector("#sugiana_res_date");
if (resDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    resDateInput.value = tomorrow.toISOString().split("T")[0];
}

// Submit Form & Pembuatan Tiket Konfirmasi Digital
const contactForm = document.querySelector("#sugiana_contact_form");
const bookingTicket = document.querySelector("#sugiana_booking_ticket");
const ticketHeading = document.querySelector("#sugiana_ticket_heading");
const ticketSummary = document.querySelector("#sugiana_ticket_summary");
const copyBookingBtn = document.querySelector("#sugiana_copy_booking_btn");
const ticketCopyMsg = document.querySelector("#sugiana_ticket_copy_msg");

if (contactForm && bookingTicket) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nama = document.querySelector("#sugiana_ct_name").value.trim();
        const kontak = document.querySelector("#sugiana_ct_phone").value.trim();
        const catatan = document.querySelector("#sugiana_ct_notes").value.trim();
        const randomCode = "SEGI-" + Math.floor(1000 + Math.random() * 9000);

        if (activeContactMode === "reservasi") {
            const tanggal = resDateInput ? resDateInput.value : "Terjadwal";
            const tamu = document.querySelector("#sugiana_res_guests").value;
            const zona = resZoneSelect ? resZoneSelect.value : "Meja Komunal";

            ticketHeading.textContent = "Kode Reservasi: #" + randomCode;
            ticketSummary.textContent =
                `Atas nama ${nama} (${kontak}) untuk ${tamu} pada tanggal ${tanggal} pukul ${selectedTimeSlot} di area ${zona}.` +
                (catatan ? ` Catatan: "${catatan}".` : "");
        } else {
            const topik = document.querySelector("#sugiana_msg_topic").value;
            ticketHeading.textContent = "Nomor Tiket Pesan: #" + randomCode;
            ticketSummary.textContent =
                `Terima kasih, ${nama}. Pesan Anda mengenai "${topik}" telah tercatat dan tim kami akan segera menghubungi ${kontak}.`;
        }

        ticketCopyMsg.textContent = "";
        bookingTicket.classList.add("sugiana_ticket_show");
    });
}

if (copyBookingBtn && ticketSummary) {
    copyBookingBtn.addEventListener("click", () => {
        const textToCopy = `${ticketHeading.textContent}\n${ticketSummary.textContent}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).catch(() => {});
        }
        ticketCopyMsg.textContent = "Bukti konfirmasi disalin!";
    });
}