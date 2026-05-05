/* core-plan.js v0.2.0 — 작업계획서 로직 레이어
   의존: plan-template.js (MUSAI_PLAN)
   수정 규칙: var 선언 유지 / const·let 금지
   장비 목록: 산업안전보건기준에 관한 규칙 제38조 + 별표3 기준
*/

var MUSAI_CORE = (function () {

  /* 장비별 재해유형 DB */
  var acc_db = {

    /* 크레인 공통 (이동식·카고·크롤러·타워) */
    crane: [
      { risk: '중량물 인양',   occur: '떨어짐', acc: '고소작업자가 인양 중인 중량물에 맞고 떨어짐',          meas: '고소작업자 안전조치 철저 (안전난간·추락방호망·안전대)' },
      { risk: '중량물 인양',   occur: '떨어짐', acc: '중량물과 함께 탑승한 작업자가 균형을 잃고 떨어짐',    meas: '인양함 등에 작업자 탑승 금지' },
      { risk: '중량물 인양',   occur: '맞음',   acc: '인양 중인 중량물이 떨어져 아래 작업자가 맞음',         meas: '2줄 걸이·훅 해지장치 사용 / 정격하중 준수 / 인양구간 하부 출입금지' },
      { risk: '크레인 넘어짐', occur: '깔림',   acc: '인양작업 중 크레인 전복으로 주변 작업자 깔림',         meas: '평평한 곳 설치 / 아웃트리거 설치·지반 확인 / 정격하중 준수' },
      { risk: '크레인 넘어짐', occur: '깔림',   acc: '선회부 볼트·붐 파단으로 크레인 넘어짐',               meas: '정기 볼트 체결 확인 / 붐 용접부 비파괴검사 실시' },
      { risk: '용도 외 사용',  occur: '떨어짐', acc: '이동식 크레인을 고소작업용으로 사용하다가 작업자 떨어짐', meas: '고소작업대 사용이 곤란한 경우에만 탑승설비 설치 (차량탑재형 불가)' }
    ],

    /* 지게차 */
    forklift: [
      { risk: '지게차 작업', occur: '맞음',   acc: '후진 중인 지게차에 보행 근로자가 맞음',                meas: '후진 경보음 장치 / 유도자 배치 / 보행자 통제구역 설정' },
      { risk: '지게차 작업', occur: '넘어짐', acc: '과적·급선회로 지게차 전복',                            meas: '최대 적재량 준수 / 급선회 금지 / 경사면 주행 시 화물 앞쪽 유지' },
      { risk: '지게차 작업', occur: '끼임',   acc: '포크 승하강 중 작업자 끼임',                          meas: '포크 주변 작업자 접근 금지 / 작업 전 확인 신호' },
      { risk: '지게차 작업', occur: '맞음',   acc: '불안정 적재물이 낙하하여 주변 작업자 맞음',             meas: '화물 적재상태 확인 후 이동 / 이동경로 출입 통제' }
    ],

    /* 굴착기 */
    excavator: [
      { risk: '굴착기 작업', occur: '맞음',   acc: '선회 중인 붐·버킷에 보행 근로자 맞음',                meas: '선회반경 내 출입금지 / 유도자 배치 / 경보음 작동 확인' },
      { risk: '굴착기 작업', occur: '깔림',   acc: '작업 중 굴착기 전복으로 주변 근로자 깔림',            meas: '평탄한 지반 확인 / 경사면 작업 시 전복방지 조치' },
      { risk: '굴착기 작업', occur: '맞음',   acc: '버킷 낙하·이탈로 주변 근로자 맞음',                  meas: '버킷 연결핀 이탈방지 고정 / 하부 출입금지' },
      { risk: '굴착기 작업', occur: '떨어짐', acc: '법면 작업 중 굴착기 미끄러져 운전원 떨어짐',           meas: '법면 경사도 확인 / 작업 전 지반 강도 측정' }
    ],

    /* 덤프트럭·화물자동차 공통 */
    dump_truck: [
      { risk: '운반기계 작업', occur: '맞음',   acc: '후진 중인 덤프트럭에 근로자 맞음',                  meas: '후진 경보음 / 유도자 배치 / 후방 카메라 설치' },
      { risk: '운반기계 작업', occur: '맞음',   acc: '적재물 낙하·흘러내림으로 근로자 맞음',              meas: '과적 금지 / 덮개 설치 / 이동경로 출입 통제' },
      { risk: '운반기계 작업', occur: '넘어짐', acc: '경사지에서 덤핑 중 차량 전복',                      meas: '수평 지반 확인 후 덤핑 / 경사면 측면 덤핑 금지' }
    ],

    /* 콘크리트 펌프카 */
    pump_car: [
      { risk: '펌프카 작업', occur: '맞음',   acc: '붐 선회 중 근로자 맞음',                              meas: '선회반경 내 출입금지 / 유도자 신호 확인' },
      { risk: '펌프카 작업', occur: '넘어짐', acc: '아웃트리거 미설치·지반 약화로 펌프카 전복',            meas: '아웃트리거 완전 전개·지반 확인 / 작업 전 점검표 확인' },
      { risk: '펌프카 작업', occur: '맞음',   acc: '호스 파열·탈락으로 콘크리트 분출 시 근로자 맞음',     meas: '호스 연결 볼트 체결 확인 / 방호망 설치' }
    ],

    /* 불도저 */
    bulldozer: [
      { risk: '불도저 작업', occur: '맞음',   acc: '후진 중인 불도저에 뒤쪽 근로자가 맞음',               meas: '후진 경보음 장치 / 유도자 배치 / 작업반경 출입금지' },
      { risk: '불도저 작업', occur: '깔림',   acc: '법면 굴삭 중 불도저 전복으로 운전원 깔림',            meas: '법면 경사도 확인 / 안전한 작업각도 유지 / 비탈면 하단부 작업 시 버팀목 설치' },
      { risk: '불도저 작업', occur: '끼임',   acc: '블레이드·배토판 하강 중 주변 근로자 끼임',            meas: '블레이드 조작 전 주변 근로자 대피 확인 / 잠금핀 사용' }
    ],

    /* 로더 */
    loader: [
      { risk: '로더 작업', occur: '맞음',   acc: '후진 중인 로더에 보행 근로자 맞음',                     meas: '후진 경보음 장치 / 유도자 배치 / 운행경로 근로자 출입금지' },
      { risk: '로더 작업', occur: '맞음',   acc: '버킷 낙하로 주변 근로자 맞음',                         meas: '버킷 적재 상태 확인 / 하부 출입금지 / 버킷 하강 시 경고 신호' },
      { risk: '로더 작업', occur: '넘어짐', acc: '과적 상태에서 급선회로 로더 전복',                      meas: '정격 적재용량 준수 / 급선회 금지 / 경사지 이동 시 버킷 낮게 유지' }
    ],

    /* 모터그레이더 */
    motor_grader: [
      { risk: '모터그레이더 작업', occur: '맞음',   acc: '후진 중인 모터그레이더에 근로자 맞음',           meas: '후진 경보음 장치 / 유도자 배치 / 작업구간 출입통제' },
      { risk: '모터그레이더 작업', occur: '깔림',   acc: '경사지 작업 중 전복으로 운전원 깔림',            meas: '허용 경사도 이내 작업 / 평탄 지반 확인 / 경사지 측면 작업 금지' },
      { risk: '모터그레이더 작업', occur: '끼임',   acc: '블레이드 승하강 중 주변 근로자 끼임',            meas: '블레이드 조작 전 주변 근로자 대피 확인' }
    ],

    /* 스크레이퍼 */
    scraper: [
      { risk: '스크레이퍼 작업', occur: '맞음',   acc: '후진 중인 스크레이퍼에 근로자 맞음',              meas: '후진 경보음 / 유도자 배치 / 운행경로 출입금지' },
      { risk: '스크레이퍼 작업', occur: '넘어짐', acc: '경사지 이동 중 전복으로 근로자 깔림',             meas: '허용 경사도 준수 / 급제동 금지 / 경사면 횡단 금지' }
    ],

    /* 항타기·항발기 */
    pile_driver: [
      { risk: '파일 작업', occur: '맞음',   acc: '파일 인양·설치 중 낙하로 주변 근로자 맞음',             meas: '인양 중 파일 하부 출입금지 / 파일 걸이 와이어로프 2줄 이상 사용' },
      { risk: '파일 작업', occur: '깔림',   acc: '항타기 전도로 주변 근로자 깔림',                       meas: '연약지반 지반보강 후 설치 / 수직도 확인 / 아웃트리거 완전 전개' },
      { risk: '파일 작업', occur: '맞음',   acc: '리더·와이어로프 파단으로 해머 낙하 시 근로자 맞음',     meas: '와이어로프 정기 점검 / 해머 낙하구간 출입금지' },
      { risk: '파일 작업', occur: '소음·진동', acc: '항타 소음·진동으로 인근 구조물 피해 및 작업자 건강 영향', meas: '저소음·저진동 공법 적용 검토 / 방음벽 설치' }
    ],

    /* 천공기 */
    boring_machine: [
      { risk: '천공기 작업', occur: '깔림',   acc: '천공공 주변 지반 함몰로 장비 전복 후 운전원 깔림',    meas: '지반조사 후 케이싱 설치 / 지하수위 확인 / 작업 중 주변 지반침하 모니터링' },
      { risk: '천공기 작업', occur: '맞음',   acc: '천공 중 파편·토사 비산으로 주변 근로자 맞음',        meas: '방호덮개 설치 / 비산범위 내 출입금지 / 보호장구 착용' },
      { risk: '천공기 작업', occur: '맞음',   acc: '드릴로드 이탈·낙하로 주변 근로자 맞음',              meas: '드릴로드 연결 볼트 체결 확인 / 이탈방지 장치 설치' }
    ],

    /* 콘크리트 믹서트럭 */
    mixer_truck: [
      { risk: '믹서트럭 작업', occur: '맞음',   acc: '후진 중인 믹서트럭에 근로자 맞음',                 meas: '후진 경보음 / 유도자 배치 / 타설 구역 근로자 통제' },
      { risk: '믹서트럭 작업', occur: '끼임',   acc: '드럼·배출구 청소·수리 중 근로자 끼임',             meas: '드럼 완전 정지 확인 후 작업 / LOTO(잠금·꼬리표) 실시' },
      { risk: '믹서트럭 작업', occur: '넘어짐', acc: '경사지 타설 중 차량 전복',                         meas: '수평 지반 확인 / 경사면 측면 타설 금지 / 고임목 설치' }
    ],

    /* 롤러·다짐기계 */
    roller: [
      { risk: '롤러 작업', occur: '맞음',   acc: '후진 중인 롤러에 근로자 맞음',                         meas: '후진 경보음 장치 / 유도자 배치 / 다짐구간 출입금지' },
      { risk: '롤러 작업', occur: '깔림',   acc: '경사지 작업 중 롤러 전복으로 운전원 깔림',             meas: '허용 경사도 이내 작업 / 안전속도 준수 / 경사면 방향 전환 금지' },
      { risk: '롤러 작업', occur: '화상',   acc: '고온 아스팔트 포장면 위 작업 중 작업자 화상',          meas: '내열 안전화 착용 / 고온면 접근 근로자 통제 / 냉각수 준비' }
    ],

    /* 아스팔트 피니셔 */
    asphalt_finisher: [
      { risk: '피니셔 작업', occur: '맞음',   acc: '후진 중인 피니셔에 뒤쪽 근로자 맞음',                meas: '후진 경보음 / 유도자 배치 / 작업구간 후방 출입금지' },
      { risk: '피니셔 작업', occur: '화상',   acc: '고온 아스팔트 접촉으로 작업자 화상',                 meas: '내열 장갑·안전화 착용 / 고온 호퍼 주변 접근 통제 / 비상 세척수 준비' },
      { risk: '피니셔 작업', occur: '끼임',   acc: '스크리드 판 하강·확장 중 근로자 끼임',               meas: '스크리드 조작 전 주변 근로자 대피 확인 / 경고음 작동' }
    ]
  };

  /* 장비 ID → 재해 카테고리 */
  var machine_acc_map = {
    /* 크레인류 */
    mobile_crane:      'crane',
    cargo_crane:       'crane',
    crawler_crane:     'crane',
    tower_crane:       'crane',
    /* 하역·운반기계 */
    forklift:          'forklift',
    aerial_work:       'forklift',   /* 고소작업대 — 지게차 유사 위험 */
    cargo_truck:       'dump_truck',
    /* 토공·굴착기계 */
    excavator:         'excavator',
    bulldozer:         'bulldozer',
    loader:            'loader',
    motor_grader:      'motor_grader',
    scraper:           'scraper',
    /* 운반기계 */
    dump_truck:        'dump_truck',
    /* 기초·말뚝기계 */
    pile_driver:       'pile_driver',
    boring_machine:    'boring_machine',
    /* 콘크리트기계 */
    pump_car:          'pump_car',
    mixer_truck:       'mixer_truck',
    /* 도로포장기계 */
    asphalt_finisher:  'asphalt_finisher',
    roller:            'roller'
  };

  /* 장비 ID → 양중 장(2페이지) 필요 여부 */
  var machine_heavy = {
    mobile_crane:      true,
    cargo_crane:       true,
    crawler_crane:     true,
    tower_crane:       true,
    forklift:          false,
    aerial_work:       false,
    cargo_truck:       false,
    excavator:         false,
    bulldozer:         false,
    loader:            false,
    motor_grader:      false,
    scraper:           false,
    dump_truck:        false,
    pile_driver:       false,
    boring_machine:    false,
    pump_car:          false,
    mixer_truck:       false,
    asphalt_finisher:  false,
    roller:            false
  };

  /* 장비 ID → 표시명 */
  var machine_labels = {
    mobile_crane:      '이동식 크레인',
    cargo_crane:       '카고 크레인',
    crawler_crane:     '크롤러 크레인',
    tower_crane:       '타워크레인',
    forklift:          '지게차',
    aerial_work:       '고소작업대',
    cargo_truck:       '화물자동차',
    excavator:         '굴착기',
    bulldozer:         '불도저',
    loader:            '로더',
    motor_grader:      '모터그레이더',
    scraper:           '스크레이퍼',
    dump_truck:        '덤프트럭',
    pile_driver:       '항타기·항발기',
    boring_machine:    '천공기',
    pump_car:          '콘크리트 펌프카',
    mixer_truck:       '콘크리트 믹서트럭',
    asphalt_finisher:  '아스팔트 피니셔',
    roller:            '롤러·다짐기계'
  };

  function getAccidentItems(machineId) {
    var cat = machine_acc_map[machineId] || 'excavator';
    var src = acc_db[cat] || acc_db.excavator;
    return src.map(function (r) {
      return { risk: r.risk, occur: r.occur, acc: r.acc, meas: r.meas };
    });
  }

  function isHeavyMachine(machineId) {
    return !!machine_heavy[machineId];
  }

  function getMachineLabel(machineId) {
    return machine_labels[machineId] || machineId;
  }

  return {
    getAccidentItems: getAccidentItems,
    isHeavyMachine:   isHeavyMachine,
    getMachineLabel:  getMachineLabel
  };

}());
