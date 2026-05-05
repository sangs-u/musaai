/* ============================================================
   core.js — 무사이(Musai) 핵심 계산 엔진
   ============================================================
   이 파일은 UI(화면)에 의존하지 않는 순수 계산 로직만 담습니다.
   공용 서비스(index.html)와 개인 관리자 페이지가 공통으로 import합니다.

   포함 항목:
     - 상수 (SF_SLING, EFF_MAP)
     - 슬링 규격 DB (WIRE, BELT, CHAIN)
     - 계산 함수 (chokeCapFactor, calcKM, calc)
     - fmt 포맷 헬퍼 (S 상태를 외부에서 주입)

   사용 방법:
     <script src="core.js"></script>   (브라우저)
     import * as Core from './core.js' (ESM / Vite)
   ============================================================ */

'use strict';

/* ── 상수 ── */
const SF_SLING = 5;

const EFF_MAP = {
  socket:    1.000,
  lock_24:   0.950,
  lock_26:   0.925,
  splice_6:  0.900,
  splice_9:  0.880,
  splice_12: 0.860,
  splice_18: 0.820,
  clip:      0.750,
};

/* ── 슬링 규격 DB (SWL 단위: kg) ── */
const WIRE = [
  {l:'φ9mm',  swl:750},
  {l:'φ10mm', swl:900},
  {l:'φ12mm', swl:1350},
  {l:'φ14mm', swl:1800},
  {l:'φ16mm', swl:2400},
  {l:'φ18mm', swl:3000},
  {l:'φ22mm', swl:4500},
  {l:'φ26mm', swl:6000},
  {l:'직접 입력',         swl:-1},
  {l:'파단하중(BL)으로 계산', swl:-2},
];

const BELT = [
  {l:'1t급',  swl:1000},
  {l:'2t급',  swl:2000},
  {l:'3t급',  swl:3000},
  {l:'5t급',  swl:5000},
  {l:'8t급',  swl:8000},
  {l:'10t급', swl:10000},
  {l:'직접 입력', swl:-1},
];

const CHAIN = [
  {l:'G80 φ7mm',  swl:1120},
  {l:'G80 φ8mm',  swl:1500},
  {l:'G80 φ10mm', swl:2360},
  {l:'G80 φ13mm', swl:3980},
  {l:'G80 φ16mm', swl:6300},
  {l:'G80 φ19mm', swl:8600},
  {l:'직접 입력',  swl:-1},
];

/* ── 단계명 ── */
const STEPS_ARR = ['', '인양하중 설정', '줄걸이 방식', '각도 입력', '슬링 검토', '달기기구', '종합 결과'];

/* ============================================================
   계산 함수들 — 모두 순수 함수 (side-effect 없음)
   ============================================================ */

/**
 * 초크 걸이 정격용량계수
 * KOSHA M-94-2011 표1 기준
 * @param {number} angleDeg - 조임각 (도)
 * @returns {number} 0~1 사이 계수
 */
function chokeCapFactor(angleDeg) {
  if (angleDeg > 120) return 1.00;
  if (angleDeg >= 90) return 0.87;
  if (angleDeg >= 60) return 0.74;
  if (angleDeg >= 30) return 0.62;
  return 0.49;
}

/**
 * 각도계수(K)·모드계수(M) 계산
 * KOSHA M-94-2011 표1 기준
 * M은 걸이 방식(S.mode)으로만 결정: 수직 1.0 / 바스켓 2.0 / 초크 0.8
 * @param {object} S - 앱 상태 객체 (alpha, lines, mode)
 * @returns {{K, M, effN, invalid, betaDeg}}
 */
function calcKM(S) {
  const betaDeg = S.alpha / 2;
  const betaRad = betaDeg * Math.PI / 180;
  let K = 1.0, effN = 1, invalid = false;
  const M = S.mode === 1 ? 2.0 : S.mode === 2 ? 0.8 : 1.0;

  if (S.lines === 1) {
    effN = 1; K = 1.0;
  } else if (S.lines === 2) {
    effN = 2;
    if (betaDeg > 60) { invalid = true; }
    else { K = 1 / Math.cos(betaRad); }
  } else {
    // 3줄 이상 → KOSHA: 유효 줄 수 3줄 산정
    effN = 3;
    if (betaDeg > 60) { invalid = true; }
    else { K = 1 / Math.cos(betaRad); }
  }
  return { K, M, effN, invalid, betaDeg };
}

/**
 * 전체 안전성 계산
 * @param {object} S - 앱 상태 객체
 * @returns {object} 계산 결과 객체
 */
function calc(S) {
  const W = S.weight * S.dynK;
  const { K, M, effN, invalid } = calcKM(S);

  let sWLL = S.sWLL;
  if (S.sType === 'wire' && S.sCustBL) {
    sWLL = (S.wireBL * S.wireEff) / S.wireSF;
  }

  const capFactor    = S.mode === 2 ? chokeCapFactor(S.chokeAngle) : 1.0;
  const effectiveSWL = sWLL * capFactor;
  const totalCap     = invalid ? 0 : (effectiveSWL * effN * M) / K;
  const Ts           = invalid ? Infinity : (W * K) / (effN * M);
  const sr           = (totalCap > 0 && sWLL > 0) ? W / totalCap : Infinity;
  const hr           = S.hookLoad > 0 ? W / S.hookLoad : Infinity;
  const ur           = (S.upShUse && S.upShSWL > 0) ? W / S.upShSWL : 0;
  const lr           = (S.loShUse && S.loShSWL > 0 && isFinite(Ts))
                         ? Ts / S.loShSWL
                         : (S.loShUse && S.loShSWL <= 0 ? Infinity : 0);

  const st = r => (!isFinite(r) || r > 1) ? 'ng' : r > 0.85 ? 'warn' : 'ok';

  return {
    W, K, M, effN, sWLL, effectiveSWL, capFactor, totalCap, Ts,
    sr, hr, ur, lr, invalid,
    sS: invalid ? 'ng' : sWLL <= 0 ? 'ng' : st(sr),
    hS: S.hookLoad <= 0 ? 'ng' : st(hr),
    uS: S.upShUse ? (S.upShSWL <= 0 ? 'ng' : st(ur)) : 'na',
    lS: S.loShUse ? (S.loShSWL <= 0 ? 'ng' : st(lr)) : 'na',
  };
}

/**
 * 현재 슬링 타입에 해당하는 규격 배열 반환
 * @param {object} S - 앱 상태 객체
 * @returns {Array}
 */
function getSO(S) {
  return S.sType === 'wire' ? WIRE : S.sType === 'belt' ? BELT : CHAIN;
}

/* ============================================================
   포맷 헬퍼 팩토리
   S 상태를 주입해서 fmt 객체를 생성합니다.
   ============================================================ */

/**
 * fmt 객체 생성
 * @param {object} S - 앱 상태 객체 (unitT 참조)
 * @returns {object} 포맷 헬퍼 모음
 */
function createFmt(S) {
  return {
    val:  kg  => !isFinite(kg) || kg < 0
                   ? '—'
                   : S.unitT
                     ? (kg / 1000).toFixed(2) + 't'
                     : Math.round(kg).toLocaleString() + 'kg',

    pct:  r   => (!isFinite(r) || r <= 0) ? '—' : Math.round(r * 100) + '%',

    inp:  kg  => (!kg || kg <= 0)
                   ? ''
                   : S.unitT
                     ? parseFloat((kg / 1000).toFixed(3))
                     : Math.round(kg),

    toKg: v   => { const n = parseFloat(v) || 0; return S.unitT ? n * 1000 : n; },

    unit: ()  => S.unitT ? 't' : 'kg',

    swlLabel: o => {
      if (o.swl < 0) return o.l;
      const s = S.unitT
        ? (o.swl / 1000).toFixed(2) + 't'
        : o.swl.toLocaleString() + 'kg';
      return o.l + ' — SWL ' + s;
    },
  };
}
