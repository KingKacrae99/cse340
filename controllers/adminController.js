// POST handler inside your administrative management controller
async function handleCreateNewTierFromDashboard(req, res, next) {
    const { custom_tier_name, classification_id, base_apr } = req.body;
    
    // 1. Insert the new clean display name text safely into the lookup catalog
    const nameCatalogSql = `INSERT INTO public.tier_names_catalog (display_name) VALUES ($1) RETURNING name_id`;
    const nameResult = await pool.query(nameCatalogSql, [custom_tier_name]);
    const generatedNameId = nameResult.rows[0].name_id;
    
    // 2. Tie it together inside your main configuration matrix
    const tierSql = `INSERT INTO public.finance_tiers (name_id, classification_id, base_apr) VALUES ($1, $2, $3)`;
    await pool.query(tierSql, [generatedNameId, classification_id, base_apr]);
    
    req.flash("notice", "New asset acquisition tier activated successfully.");
    res.redirect("/admin/finance-management");
}