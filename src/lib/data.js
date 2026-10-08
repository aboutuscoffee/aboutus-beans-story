import { supabase } from './supabase';
import { extractSlug, extractSlugs } from './wikitext';

// 1銘柄分のフルプロトタイプ: 豆 + 関連する農園・産地・精製方法を read-only で取得する
export async function fetchBeanStory(beanId) {
  const { data: bean, error: beanError } = await supabase
    .from('beans')
    .select('*')
    .eq('id', beanId)
    .single();
  if (beanError) throw new Error(beanError.message);

  const farmSlug = extractSlug(bean.region, 'farm');
  const countrySlug = extractSlug(bean.origin, 'country');
  const processSlug = extractSlug(bean.process, 'process');

  const [farmRes, countryRes, processRes] = await Promise.all([
    farmSlug ? supabase.from('farms').select('*').eq('slug', farmSlug).maybeSingle() : { data: null },
    countrySlug ? supabase.from('countries').select('*').eq('slug', countrySlug).maybeSingle() : { data: null },
    processSlug ? supabase.from('processes').select('*').eq('slug', processSlug).maybeSingle() : { data: null },
  ]);

  // 品種・精製方法の解説（termsテーブル）。リンクが無い豆では空になり、画面側で非表示にする
  const varietySlugs = extractSlugs(bean.variety, 'term');
  const processTermSlugs = extractSlugs(bean.process, 'term');
  const allTermSlugs = [...new Set([...varietySlugs, ...processTermSlugs])];
  const termsRes = allTermSlugs.length
    ? await supabase.from('terms').select('slug,name,category,body').in('slug', allTermSlugs)
    : { data: [] };
  const termsBySlug = Object.fromEntries((termsRes.data ?? []).map((t) => [t.slug, t]));

  return {
    bean,
    farm: farmRes.data,
    country: countryRes.data,
    process: processRes.data,
    varietyTerms: varietySlugs.map((s) => termsBySlug[s]).filter((t) => t?.body),
    processTerm: processTermSlugs.map((s) => termsBySlug[s]).find((t) => t?.body) ?? null,
  };
}

// ホーム画面の世界地図・横スクロールカード用: リリース中の豆を、ピン座標込みで取得する
export async function fetchReleasedBeans() {
  const { data: beans, error } = await supabase.from('beans').select('*').eq('status', 'リリース中');
  if (error) throw new Error(error.message);

  const farmSlugs = new Set();
  const countrySlugs = new Set();
  const withSlugs = beans.map((bean) => {
    const farmSlug = extractSlug(bean.region, 'farm');
    const countrySlug = extractSlug(bean.origin, 'country');
    if (farmSlug) farmSlugs.add(farmSlug);
    if (countrySlug) countrySlugs.add(countrySlug);
    return { bean, farmSlug, countrySlug };
  });

  const [farmsRes, countriesRes] = await Promise.all([
    farmSlugs.size ? supabase.from('farms').select('*').in('slug', [...farmSlugs]) : { data: [] },
    countrySlugs.size ? supabase.from('countries').select('*').in('slug', [...countrySlugs]) : { data: [] },
  ]);

  const farmsBySlug = Object.fromEntries((farmsRes.data ?? []).map((f) => [f.slug, f]));
  const countriesBySlug = Object.fromEntries((countriesRes.data ?? []).map((c) => [c.slug, c]));

  // lat/lng が無いもの（産地リンク未設定など）も一覧カードには出すが、地図ピンには使わない
  return withSlugs.map(({ bean, farmSlug, countrySlug }) => {
    const farm = farmSlug ? farmsBySlug[farmSlug] : null;
    const country = countrySlug ? countriesBySlug[countrySlug] : null;
    const lat = farm?.lat ?? country?.lat ?? null;
    const lng = farm?.lng ?? country?.lng ?? null;
    return { bean, farm, country, lat, lng };
  });
}
