/**
 * Copies index.html → dist/index.html and injects secrets from environment variables.
 * Used on Netlify (and optional local: `npm run build`).
 * Variables: WEB3FORMS_ACCESS_KEY, SHOPIFY_SHOP_DOMAIN, SHOPIFY_STOREFRONT_TOKEN,
 *            SHOPIFY_STOREFRONT_URL, SHOPIFY_COLLECTION_PATH (optional)
 */
'use strict';

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var src = path.join(root, 'index.html');
var outDir = path.join(root, 'dist');
var out = path.join(outDir, 'index.html');

function json(s) {
  return JSON.stringify(s == null ? '' : String(s));
}

var html = fs.readFileSync(src, 'utf8');

html = html.replace(/web3formsAccessKey:\s*''/m, 'web3formsAccessKey: ' + json(process.env.WEB3FORMS_ACCESS_KEY));
html = html.replace(/shopifyShopDomain:\s*''/m, 'shopifyShopDomain: ' + json(process.env.SHOPIFY_SHOP_DOMAIN));
html = html.replace(/shopifyStorefrontToken:\s*''/m, 'shopifyStorefrontToken: ' + json(process.env.SHOPIFY_STOREFRONT_TOKEN));
html = html.replace(/shopifyStorefrontUrl:\s*''/m, 'shopifyStorefrontUrl: ' + json(process.env.SHOPIFY_STOREFRONT_URL));

var collectionPath = process.env.SHOPIFY_COLLECTION_PATH || '/collections/all';
html = html.replace(/shopifyCollectionPath:\s*'[^']*'/m, 'shopifyCollectionPath: ' + json(collectionPath));

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(out, html, 'utf8');
console.log('Wrote', path.relative(root, out));
