/**
 * 접근토큰을 redis에 저장하고 검색할때,
 * value값을 비워둬야 null로 되어서 키만 조회하기떄문에 빠름
 * 그러나 null과 ""로는 구분하기힘드니
 * 상수로 만듬
 */
export const ACCESS_TOKEN_VALUE = "";
