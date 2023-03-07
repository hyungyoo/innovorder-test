export interface OpenFoodFactsDto {
  status: number;
  data: {
    product: Product;
    status_verbose: string;
  };
}

export interface Root {
  code: string;
  product: Product;
  status: number;
  status_verbose: string;
}

export interface Product {
  _id: string;
  _keywords: string[];
  added_countries_tags: any[];
  additives_debug_tags: any[];
  additives_n: number;
  additives_old_n: number;
  additives_old_tags: string[];
  additives_original_tags: string[];
  additives_prev_original_tags: string[];
  additives_tags: string[];
  allergens: string;
  allergens_from_ingredients: string;
  allergens_from_user: string;
  allergens_hierarchy: string[];
  allergens_tags: string[];
  amino_acids_prev_tags: any[];
  amino_acids_tags: any[];
  brand_owner: string;
  brand_owner_imported: string;
  brands: string;
  brands_tags: string[];
  categories: string;
  categories_hierarchy: string[];
  categories_imported: string;
  categories_lc: string;
  categories_old: string;
  categories_properties: CategoriesProperties;
  categories_properties_tags: string[];
  categories_tags: string[];
  category_properties: CategoryProperties;
  checkers: any[];
  checkers_tags: any[];
  ciqual_food_name_tags: string[];
  cities_tags: any[];
  code: string;
  codes_tags: string[];
  compared_to_category: string;
  complete: number;
  completeness: number;
  correctors: string[];
  correctors_tags: string[];
  countries: string;
  countries_debug_tags: any[];
  countries_hierarchy: string[];
  countries_imported: string;
  countries_lc: string;
  countries_tags: string[];
  created_t: number;
  creator: string;
  data_quality_bugs_tags: any[];
  data_quality_errors_tags: any[];
  data_quality_info_tags: string[];
  data_quality_tags: string[];
  data_quality_warnings_tags: string[];
  data_sources: string;
  data_sources_imported: string;
  data_sources_tags: string[];
  debug_param_sorted_langs: string[];
  ecoscore_data: EcoscoreData;
  ecoscore_grade: string;
  ecoscore_tags: string[];
  editors: string[];
  editors_tags: string[];
  emb_codes: string;
  emb_codes_20141016: string;
  emb_codes_debug_tags: any[];
  emb_codes_orig: string;
  emb_codes_tags: any[];
  entry_dates_tags: string[];
  expiration_date: string;
  expiration_date_debug_tags: any[];
  food_groups: string;
  food_groups_tags: string[];
  "fruits-vegetables-nuts_100g_estimate": number;
  generic_name: string;
  generic_name_en: string;
  generic_name_en_debug_tags: any[];
  id: string;
  image_front_small_url: string;
  image_front_thumb_url: string;
  image_front_url: string;
  image_ingredients_small_url: string;
  image_ingredients_thumb_url: string;
  image_ingredients_url: string;
  image_nutrition_small_url: string;
  image_nutrition_thumb_url: string;
  image_nutrition_url: string;
  image_small_url: string;
  image_thumb_url: string;
  image_url: string;
  images: Images;
  informers: string[];
  informers_tags: string[];
  ingredients: Ingredient[];
  ingredients_analysis: IngredientsAnalysis;
  ingredients_analysis_tags: string[];
  ingredients_debug: string | undefined[];
  ingredients_from_or_that_may_be_from_palm_oil_n: number;
  ingredients_from_palm_oil_n: number;
  ingredients_from_palm_oil_tags: any[];
  ingredients_hierarchy: string[];
  ingredients_ids_debug: string[];
  ingredients_n: number;
  ingredients_n_tags: string[];
  ingredients_original_tags: string[];
  ingredients_percent_analysis: number;
  ingredients_tags: string[];
  ingredients_text: string;
  ingredients_text_debug: string;
  ingredients_text_en: string;
  ingredients_text_en_debug_tags: any[];
  ingredients_text_en_imported: string;
  ingredients_text_with_allergens: string;
  ingredients_text_with_allergens_en: string;
  ingredients_that_may_be_from_palm_oil_n: number;
  ingredients_that_may_be_from_palm_oil_tags: any[];
  ingredients_with_specified_percent_n: number;
  ingredients_with_specified_percent_sum: number;
  ingredients_with_unspecified_percent_n: number;
  ingredients_with_unspecified_percent_sum: number;
  interface_version_created: string;
  interface_version_modified: string;
  known_ingredients_n: number;
  labels: string;
  labels_hierarchy: string[];
  labels_lc: string;
  labels_old: string;
  labels_tags: string[];
  lang: string;
  lang_debug_tags: any[];
  languages: Languages;
  languages_codes: LanguagesCodes;
  languages_hierarchy: string[];
  languages_tags: string[];
  last_edit_dates_tags: string[];
  last_image_dates_tags: string[];
  last_image_t: number;
  last_modified_t: number;
  lc: string;
  lc_imported: string;
  link: string;
  link_debug_tags: any[];
  main_countries_tags: any[];
  manufacturing_places: string;
  manufacturing_places_debug_tags: any[];
  manufacturing_places_tags: any[];
  max_imgid: string;
  minerals_prev_tags: any[];
  minerals_tags: any[];
  misc_tags: string[];
  new_additives_n: number;
  no_nutrition_data: string;
  nova_group: number;
  nova_group_debug: string;
  nova_groups: string;
  nova_groups_markers: NovaGroupsMarkers;
  nova_groups_tags: string[];
  nucleotides_prev_tags: any[];
  nucleotides_tags: any[];
  nutrient_levels: NutrientLevels;
  nutrient_levels_tags: string[];
  nutriments: Nutriments;
  nutriscore_data: NutriscoreData;
  nutriscore_grade: string;
  nutriscore_score: number;
  nutriscore_score_opposite: number;
  nutrition_data: string;
  nutrition_data_per: string;
  nutrition_data_per_debug_tags: any[];
  nutrition_data_per_imported: string;
  nutrition_data_prepared: string;
  nutrition_data_prepared_per: string;
  nutrition_data_prepared_per_debug_tags: any[];
  nutrition_data_prepared_per_imported: string;
  nutrition_grade_fr: string;
  nutrition_grades: string;
  nutrition_grades_tags: string[];
  nutrition_score_beverage: number;
  nutrition_score_debug: string;
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients: number;
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients_value: number;
  origins: string;
  origins_hierarchy: string[];
  origins_lc: string;
  origins_old: string;
  origins_tags: string[];
  other_nutritional_substances_tags: any[];
  packaging: string;
  packaging_hierarchy: string[];
  packaging_lc: string;
  packaging_old: string;
  packaging_old_before_taxonomization: string;
  packaging_tags: string[];
  packagings: Packaging3[];
  photographers: string[];
  photographers_tags: string[];
  pnns_groups_1: string;
  pnns_groups_1_tags: string[];
  pnns_groups_2: string;
  pnns_groups_2_tags: string[];
  popularity_key: number;
  popularity_tags: string[];
  product_name: string;
  product_name_en: string;
  product_name_en_debug_tags: any[];
  product_name_en_imported: string;
  product_quantity: string;
  purchase_places: string;
  purchase_places_debug_tags: any[];
  purchase_places_tags: any[];
  quantity: string;
  quantity_debug_tags: any[];
  removed_countries_tags: any[];
  rev: number;
  scans_n: number;
  selected_images: SelectedImages;
  serving_quantity: string;
  serving_size: string;
  serving_size_debug_tags: any[];
  serving_size_imported: string;
  sortkey: number;
  sources: Source[];
  sources_fields: SourcesFields;
  states: string;
  states_hierarchy: string[];
  states_tags: string[];
  stores: string;
  stores_debug_tags: any[];
  stores_tags: any[];
  traces: string;
  traces_debug_tags: any[];
  traces_from_ingredients: string;
  traces_from_user: string;
  traces_hierarchy: string[];
  traces_tags: string[];
  unique_scans_n: number;
  unknown_ingredients_n: number;
  unknown_nutrients_tags: any[];
  update_key: string;
  vitamins_prev_tags: any[];
  vitamins_tags: any[];
  weighers_tags: any[];
}

export interface CategoriesProperties {}

export interface CategoryProperties {}

export interface EcoscoreData {
  adjustments: Adjustments;
  agribalyse: Agribalyse;
  missing: Missing;
  missing_agribalyse_match_warning: number;
  scores: Scores;
  status: string;
}

export interface Adjustments {
  origins_of_ingredients: OriginsOfIngredients;
  packaging: Packaging;
  production_system: ProductionSystem;
  threatened_species: ThreatenedSpecies;
}

export interface OriginsOfIngredients {
  aggregated_origins: AggregatedOrigin[];
  epi_score: number;
  epi_value: number;
  origins_from_origins_field: string[];
  transportation_score: number;
  transportation_scores: TransportationScores;
  transportation_value: number;
  transportation_values: TransportationValues;
  value: number;
  values: Values;
}

export interface AggregatedOrigin {
  epi_score: string;
  origin: string;
  percent: number;
  transportation_score: any;
}

export interface TransportationScores {
  ad: number;
  al: number;
  at: number;
  ax: number;
  ba: number;
  be: number;
  bg: number;
  ch: number;
  cy: number;
  cz: number;
  de: number;
  dk: number;
  dz: number;
  ee: number;
  eg: number;
  es: number;
  fi: number;
  fo: number;
  fr: number;
  gg: number;
  gi: number;
  gr: number;
  hr: number;
  hu: number;
  ie: number;
  il: number;
  im: number;
  is: number;
  it: number;
  je: number;
  lb: number;
  li: number;
  lt: number;
  lu: number;
  lv: number;
  ly: number;
  ma: number;
  mc: number;
  md: number;
  me: number;
  mk: number;
  mt: number;
  nl: number;
  no: number;
  pl: number;
  ps: number;
  pt: number;
  ro: number;
  rs: number;
  se: number;
  si: number;
  sj: number;
  sk: number;
  sm: number;
  sy: number;
  tn: number;
  tr: number;
  ua: number;
  uk: number;
  us: number;
  va: number;
  world: number;
  xk: number;
}

export interface TransportationValues {
  ad: number;
  al: number;
  at: number;
  ax: number;
  ba: number;
  be: number;
  bg: number;
  ch: number;
  cy: number;
  cz: number;
  de: number;
  dk: number;
  dz: number;
  ee: number;
  eg: number;
  es: number;
  fi: number;
  fo: number;
  fr: number;
  gg: number;
  gi: number;
  gr: number;
  hr: number;
  hu: number;
  ie: number;
  il: number;
  im: number;
  is: number;
  it: number;
  je: number;
  lb: number;
  li: number;
  lt: number;
  lu: number;
  lv: number;
  ly: number;
  ma: number;
  mc: number;
  md: number;
  me: number;
  mk: number;
  mt: number;
  nl: number;
  no: number;
  pl: number;
  ps: number;
  pt: number;
  ro: number;
  rs: number;
  se: number;
  si: number;
  sj: number;
  sk: number;
  sm: number;
  sy: number;
  tn: number;
  tr: number;
  ua: number;
  uk: number;
  us: number;
  va: number;
  world: number;
  xk: number;
}

export interface Values {
  ad: number;
  al: number;
  at: number;
  ax: number;
  ba: number;
  be: number;
  bg: number;
  ch: number;
  cy: number;
  cz: number;
  de: number;
  dk: number;
  dz: number;
  ee: number;
  eg: number;
  es: number;
  fi: number;
  fo: number;
  fr: number;
  gg: number;
  gi: number;
  gr: number;
  hr: number;
  hu: number;
  ie: number;
  il: number;
  im: number;
  is: number;
  it: number;
  je: number;
  lb: number;
  li: number;
  lt: number;
  lu: number;
  lv: number;
  ly: number;
  ma: number;
  mc: number;
  md: number;
  me: number;
  mk: number;
  mt: number;
  nl: number;
  no: number;
  pl: number;
  ps: number;
  pt: number;
  ro: number;
  rs: number;
  se: number;
  si: number;
  sj: number;
  sk: number;
  sm: number;
  sy: number;
  tn: number;
  tr: number;
  ua: number;
  uk: number;
  us: number;
  va: number;
  world: number;
  xk: number;
}

export interface Packaging {
  non_recyclable_and_non_biodegradable_materials: number;
  packagings: Packaging2[];
  score: number;
  value: number;
  warning: string;
}

export interface Packaging2 {
  ecoscore_material_score: number;
  ecoscore_shape_ratio: number;
  material: string;
  shape: string;
}

export interface ProductionSystem {
  labels: any[];
  value: number;
  warning: string;
}

export interface ThreatenedSpecies {}

export interface Agribalyse {
  warning: string;
}

export interface Missing {
  agb_category: number;
  labels: number;
  packagings: number;
}

export interface Scores {}

export interface Images {
  "1": N1;
  "2": N2;
  "3": N3;
  "4": N4;
  "5": N5;
  front: Front;
  front_en: FrontEn;
  ingredients: Ingredients;
  ingredients_en: IngredientsEn;
  nutrition: Nutrition;
  nutrition_en: NutritionEn;
}

export interface N1 {
  sizes: Sizes;
  uploaded_t: number;
  uploader: string;
}

export interface Sizes {
  "100": N100;
  "400": N400;
  full: Full;
}

export interface N100 {
  h: number;
  w: number;
}

export interface N400 {
  h: number;
  w: number;
}

export interface Full {
  h: number;
  w: number;
}

export interface N2 {
  sizes: Sizes2;
  uploaded_t: number;
  uploader: string;
}

export interface Sizes2 {
  "100": N1002;
  "400": N4002;
  full: Full2;
}

export interface N1002 {
  h: number;
  w: number;
}

export interface N4002 {
  h: number;
  w: number;
}

export interface Full2 {
  h: number;
  w: number;
}

export interface N3 {
  sizes: Sizes3;
  uploaded_t: number;
  uploader: string;
}

export interface Sizes3 {
  "100": N1003;
  "400": N4003;
  full: Full3;
}

export interface N1003 {
  h: number;
  w: number;
}

export interface N4003 {
  h: number;
  w: number;
}

export interface Full3 {
  h: number;
  w: number;
}

export interface N4 {
  sizes: Sizes4;
  uploaded_t: number;
  uploader: string;
}

export interface Sizes4 {
  "100": N1004;
  "400": N4004;
  full: Full4;
}

export interface N1004 {
  h: number;
  w: number;
}

export interface N4004 {
  h: number;
  w: number;
}

export interface Full4 {
  h: number;
  w: number;
}

export interface N5 {
  sizes: Sizes5;
  uploaded_t: number;
  uploader: string;
}

export interface Sizes5 {
  "100": N1005;
  "400": N4005;
  full: Full5;
}

export interface N1005 {
  h: number;
  w: number;
}

export interface N4005 {
  h: number;
  w: number;
}

export interface Full5 {
  h: number;
  w: number;
}

export interface Front {
  geometry: string;
  imgid: string;
  normalize: any;
  rev: string;
  sizes: Sizes6;
  white_magic: any;
}

export interface Sizes6 {
  "100": N1006;
  "200": N200;
  "400": N4006;
  full: Full6;
}

export interface N1006 {
  h: number;
  w: number;
}

export interface N200 {
  h: number;
  w: number;
}

export interface N4006 {
  h: number;
  w: number;
}

export interface Full6 {
  h: number;
  w: number;
}

export interface FrontEn {
  geometry: string;
  imgid: string;
  normalize: any;
  rev: string;
  sizes: Sizes7;
  white_magic: any;
}

export interface Sizes7 {
  "100": N1007;
  "200": N2002;
  "400": N4007;
  full: Full7;
}

export interface N1007 {
  h: number;
  w: number;
}

export interface N2002 {
  h: number;
  w: number;
}

export interface N4007 {
  h: number;
  w: number;
}

export interface Full7 {
  h: number;
  w: number;
}

export interface Ingredients {
  geometry: string;
  imgid: string;
  normalize: string;
  rev: string;
  sizes: Sizes8;
  white_magic: any;
}

export interface Sizes8 {
  "100": N1008;
  "200": N2003;
  "400": N4008;
  full: Full8;
}

export interface N1008 {
  h: number;
  w: number;
}

export interface N2003 {
  h: number;
  w: number;
}

export interface N4008 {
  h: number;
  w: number;
}

export interface Full8 {
  h: number;
  w: number;
}

export interface IngredientsEn {
  geometry: string;
  imgid: string;
  normalize: string;
  rev: string;
  sizes: Sizes9;
  white_magic: any;
}

export interface Sizes9 {
  "100": N1009;
  "200": N2004;
  "400": N4009;
  full: Full9;
}

export interface N1009 {
  h: number;
  w: number;
}

export interface N2004 {
  h: number;
  w: number;
}

export interface N4009 {
  h: number;
  w: number;
}

export interface Full9 {
  h: number;
  w: number;
}

export interface Nutrition {
  geometry: string;
  imgid: string;
  normalize: string;
  rev: string;
  sizes: Sizes10;
  white_magic: any;
}

export interface Sizes10 {
  "100": N10010;
  "200": N2005;
  "400": N40010;
  full: Full10;
}

export interface N10010 {
  h: number;
  w: number;
}

export interface N2005 {
  h: number;
  w: number;
}

export interface N40010 {
  h: number;
  w: number;
}

export interface Full10 {
  h: number;
  w: number;
}

export interface NutritionEn {
  geometry: string;
  imgid: string;
  normalize: string;
  rev: string;
  sizes: Sizes11;
  white_magic: any;
}

export interface Sizes11 {
  "100": N10011;
  "200": N2006;
  "400": N40011;
  full: Full11;
}

export interface N10011 {
  h: number;
  w: number;
}

export interface N2006 {
  h: number;
  w: number;
}

export interface N40011 {
  h: number;
  w: number;
}

export interface Full11 {
  h: number;
  w: number;
}

export interface Ingredient {
  has_sub_ingredients?: string;
  id: string;
  percent_estimate: number;
  percent_max: number;
  percent_min: number;
  rank?: number;
  text: string;
  vegan?: string;
  vegetarian?: string;
  processing?: string;
}

export interface IngredientsAnalysis {
  "en:palm-oil-content-unknown": string[];
  "en:vegan-status-unknown": string[];
  "en:vegetarian-status-unknown": string[];
}

export interface Languages {
  "en:english": number;
}

export interface LanguagesCodes {
  en: number;
}

export interface NovaGroupsMarkers {
  "3": string[][];
  "4": string[][];
}

export interface NutrientLevels {
  fat: string;
  salt: string;
  "saturated-fat": string;
  sugars: string;
}

export interface Nutriments {
  calcium: number;
  calcium_100g: number;
  calcium_serving: number;
  calcium_unit: string;
  calcium_value: number;
  carbohydrates: number;
  carbohydrates_100g: number;
  carbohydrates_serving: number;
  carbohydrates_unit: string;
  carbohydrates_value: number;
  cholesterol: number;
  cholesterol_100g: number;
  cholesterol_serving: number;
  cholesterol_unit: string;
  cholesterol_value: number;
  energy: number;
  "energy-kcal": number;
  "energy-kcal_100g": number;
  "energy-kcal_serving": number;
  "energy-kcal_unit": string;
  "energy-kcal_value": number;
  "energy-kcal_value_computed": number;
  energy_100g: number;
  energy_serving: number;
  energy_unit: string;
  energy_value: number;
  fat: number;
  fat_100g: number;
  fat_serving: number;
  fat_unit: string;
  fat_value: number;
  fiber: number;
  fiber_100g: number;
  fiber_serving: number;
  fiber_unit: string;
  fiber_value: number;
  "fruits-vegetables-nuts-estimate-from-ingredients_100g": number;
  "fruits-vegetables-nuts-estimate-from-ingredients_serving": number;
  iron: number;
  iron_100g: number;
  iron_serving: number;
  iron_unit: string;
  iron_value: number;
  "nova-group": number;
  "nova-group_100g": number;
  "nova-group_serving": number;
  "nutrition-score-fr": number;
  "nutrition-score-fr_100g": number;
  proteins: number;
  proteins_100g: number;
  proteins_serving: number;
  proteins_unit: string;
  proteins_value: number;
  salt: number;
  salt_100g: number;
  salt_serving: number;
  salt_unit: string;
  salt_value: number;
  "saturated-fat": number;
  "saturated-fat_100g": number;
  "saturated-fat_serving": number;
  "saturated-fat_unit": string;
  "saturated-fat_value": number;
  sodium: number;
  sodium_100g: number;
  sodium_serving: number;
  sodium_unit: string;
  sodium_value: number;
  sugars: number;
  sugars_100g: number;
  sugars_serving: number;
  sugars_unit: string;
  sugars_value: number;
  "trans-fat": number;
  "trans-fat_100g": number;
  "trans-fat_serving": number;
  "trans-fat_unit": string;
  "trans-fat_value": number;
  "vitamin-a": number;
  "vitamin-a_100g": number;
  "vitamin-a_serving": number;
  "vitamin-a_unit": string;
  "vitamin-a_value": number;
  "vitamin-c": number;
  "vitamin-c_100g": number;
  "vitamin-c_serving": number;
  "vitamin-c_unit": string;
  "vitamin-c_value": number;
}

export interface NutriscoreData {
  energy: number;
  energy_points: number;
  energy_value: number;
  fiber: number;
  fiber_points: number;
  fiber_value: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils_points: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils_value: number;
  grade: string;
  is_beverage: number;
  is_cheese: number;
  is_fat: number;
  is_water: number;
  negative_points: number;
  positive_points: number;
  proteins: number;
  proteins_points: number;
  proteins_value: number;
  saturated_fat: number;
  saturated_fat_points: number;
  saturated_fat_ratio: number;
  saturated_fat_ratio_points: number;
  saturated_fat_ratio_value: number;
  saturated_fat_value: number;
  score: number;
  sodium: number;
  sodium_points: number;
  sodium_value: number;
  sugars: number;
  sugars_points: number;
  sugars_value: number;
}

export interface Packaging3 {
  shape: string;
}

export interface SelectedImages {
  front: Front2;
  ingredients: Ingredients2;
  nutrition: Nutrition2;
}

export interface Front2 {
  display: Display;
  small: Small;
  thumb: Thumb;
}

export interface Display {
  en: string;
}

export interface Small {
  en: string;
}

export interface Thumb {
  en: string;
}

export interface Ingredients2 {
  display: Display2;
  small: Small2;
  thumb: Thumb2;
}

export interface Display2 {
  en: string;
}

export interface Small2 {
  en: string;
}

export interface Thumb2 {
  en: string;
}

export interface Nutrition2 {
  display: Display3;
  small: Small3;
  thumb: Thumb3;
}

export interface Display3 {
  en: string;
}

export interface Small3 {
  en: string;
}

export interface Thumb3 {
  en: string;
}

export interface Source {
  fields: string[];
  id: string;
  images: any[];
  import_t: number;
  url?: string;
  manufacturer: any;
  name?: string;
}

export interface SourcesFields {
  "org-database-usda": OrgDatabaseUsda;
}

export interface OrgDatabaseUsda {
  available_date: string;
  fdc_category: string;
  fdc_data_source: string;
  fdc_id: string;
  modified_date: string;
  publication_date: string;
}
