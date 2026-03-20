# Architecture: hummingbird

## Purpose
A PrestaShop theme that provides a modern, Bootstrap-based storefront. Includes overriding Smarty templates for a large set of standard PrestaShop modules (wishlist, bestsellers, brand list, payment modules, etc.).

## Directory Structure
```
modules/                         # Template overrides for bundled PS modules
  blockwishlist/views/templates/ # Wishlist UI templates
  ps_bestsellers/views/templates/
  ps_brandlist/views/templates/
  ps_cashondelivery/views/templates/
  ps_categoryproducts/views/templates/
  ps_checkpayment/views/templates/
  ps_crossselling/views/templates/
  ps_emailalerts/views/templates/
  ps_newproducts/views/templates/
  ps_specials/views/templates/
  ps_wirepayment/views/templates/
  ... (and more)
```

## Key Design Decisions
- **Template override pattern** — all customisation is done via PrestaShop's `modules/` override directory within the theme, not by modifying core module code.
- **No PHP business logic** — the theme contains only Smarty templates and static assets; all logic remains in core PrestaShop or its modules.
- **Bootstrap-based** — layout and component styling follow Bootstrap conventions for responsive design.

## Extension Points
- Add template overrides for additional modules by creating `modules/{module_name}/views/templates/` directories.
- Customise specific templates without forking by using PrestaShop's child-theme feature.
- Override CSS by extending or replacing the theme's stylesheet assets.

## Dependency Flow
```
PrestaShop Core
  └─ Theme (hummingbird)
       ├─ Smarty template engine
       ├─ Module template overrides in modules/*/views/templates/
       └─ Static assets (CSS, JS, images)
```
