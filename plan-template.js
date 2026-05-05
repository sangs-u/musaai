/* plan-template.js v0.2.0 — MUSAI_PLAN 스키마 DB
   KOSHA GUIDE D-C-10-2026 (2026.1.30.) 기준
   수정 규칙: var 선언 유지 / const·let 금지 / 주석 한국어
*/

var MUSAI_PLAN = (function () {

  /* ── meta ── */
  var meta = {
    version:      '0.2.0',
    last_updated: '2026-04-24',
    kosha_guide:  'D-C-10-2026 (2026.1.30.)',
    note:         '50억 미만 소규모 현장용 약식 양식 지원 추가'
  };

  /* ── shared_fields ── */
  var shared_fields = {

    /* 공통 작업 정보 */
    work_info: {
      label: '작업 개요',
      fields: {
        work_name:       { label: '작업명',          type: 'text',   required: true  },
        work_date:       { label: '작업일자',         type: 'date',   required: true  },
        work_place:      { label: '작업장소',         type: 'text',   required: true  },
        site_name:       { label: '현장명',           type: 'text',   required: true  },
        contractor:      { label: '시공사',           type: 'text',   required: false },
        supervisor:      { label: '작업지휘자',       type: 'text',   required: true  },
        safety_mgr:      { label: '안전관리자',       type: 'text',   required: false },
        worker_count:    { label: '투입 인원',        type: 'number', required: true,  unit: '명' },
        work_time_start: { label: '작업 시작시각',    type: 'time',   required: false },
        work_time_end:   { label: '작업 종료시각',    type: 'time',   required: false },
        weather:         { label: '기상 조건',        type: 'text',   required: false,
                           hint: '예: 맑음 / 풍속 3m/s' }
      }
    },

    /* 기계·장비 기본 정보 */
    equipment_basic: {
      label: '기계·장비 기본 정보',
      fields: {
        equip_name:       { label: '장비명',           type: 'text',     required: true  },
        equip_model:      { label: '모델명(형식)',      type: 'text',     required: true  },
        manufacturer:     { label: '제조사',            type: 'text',     required: false },
        serial_no:        { label: '제조번호',          type: 'text',     required: false },
        capacity:         { label: '정격 용량',         type: 'text',     required: true,  unit: 't 또는 kW' },
        manufacture_year: { label: '제조연도',          type: 'number',   required: false, unit: '년' },
        lease_co:         { label: '임대업체명',        type: 'text',     required: false },
        operator_name:    { label: '운전원 성명',       type: 'text',     required: true  },
        operator_license: { label: '면허·자격증 번호',  type: 'text',     required: false },
        inspect_date:     { label: '최근 검사일',       type: 'date',     required: false },
        inspect_org:      { label: '검사기관',          type: 'text',     required: false },
        /* v0.2.0 추가 — KOSHA GUIDE 4. 기계·장비 개요 */
        outrigger_front:    { label: '아웃트리거 폭 (전)',  type: 'text',     required: false, unit: 'mm' },
        outrigger_rear:     { label: '아웃트리거 폭 (후)',  type: 'text',     required: false, unit: 'mm' },
        boom_max_angle:     { label: '붐 최대각도',          type: 'number',   required: false, unit: '도' },
        boom_min_angle:     { label: '붐 최소각도',          type: 'number',   required: false, unit: '도' },
        hook_max_height:    { label: '훅 최대지상높이',      type: 'number',   required: false, unit: 'm'  },
        struct_change_date: { label: '구조변경일',           type: 'date',     required: false            },
        struct_change_co:   { label: '구조변경업체명',       type: 'text',     required: false            },
        repair_history:     { label: '수리·보수·점검이력',  type: 'textarea', required: false,
                              hint: '최근 수리·점검 이력 기재' }
      }
    },

    /* v0.2.0 신규 — 기계·장비 개요 및 방호장치 점검 (KOSHA GUIDE 4.) */
    equipment_check: {
      label: '기계·장비 개요 및 점검사항',
      fields: {
        sling_type: {
          label: '줄걸이 용구',
          type: 'multi-select',
          required: true,
          options: ['와이어로프', '섬유벨트(슬링)', '체인', '클램프', '하카', '샤클', '기타']
        },
        manual_exist: {
          label: '사용설명서',
          type: 'select',
          required: true,
          options: ['있음', '없음']
        },
        /* 방호장치 점검 — 정상/비정상/해당없음 */
        guard_boom_wire:    { label: '붐(와이어로프·체인 구동) 인출·선회부', type: 'select', required: true, options: ['정상', '비정상', '해당없음'] },
        guard_boom_length:  { label: '붐 인출 길이 표시장치',                 type: 'select', required: true, options: ['정상', '비정상', '해당없음'] },
        guard_boom_stop:    { label: '붐 기복 정지장치 (붐 최대각도 내)',     type: 'select', required: true, options: ['정상', '비정상', '해당없음'] },
        guard_moment:       { label: '모멘트 감지장치 (위치 제어장치)',        type: 'select', required: true, options: ['정상', '비정상', '해당없음'] },
        guard_outrigger:    { label: '아웃트리거 전도방지장치',               type: 'select', required: true, options: ['정상', '비정상', '해당없음'] },
        guard_overwind:     { label: '권과 방지장치',                         type: 'select', required: true, options: ['정상', '비정상', '해당없음'] },
        guard_overload:     { label: '과부하 방지장치',                       type: 'select', required: true, options: ['정상', '비정상', '해당없음'] },
        guard_hook_release: { label: '훅 해지장치',                           type: 'select', required: true, options: ['정상', '비정상', '해당없음'] },
        guard_hydraulic:    { label: '낙하 방지밸브 및 유압장치',             type: 'select', required: true, options: ['정상', '비정상', '해당없음'] }
      }
    },

    /* v0.2.0 신규 — 작업지휘자 역할 및 교육 (KOSHA GUIDE 7.) */
    supervisor_role: {
      label: '작업지휘자 역할 및 교육',
      fields: {
        unloading_party: {
          label: '하역작업 주체',
          type: 'select',
          required: true,
          options: ['화주 측', '운송업자 측', '받는 사업장', '공통']
        },
        edu_supervisor:    { label: '안전교육 — 작업지휘자', type: 'checkbox', required: false },
        edu_signal_count:  { label: '신호수 (명)',            type: 'number',   required: false, unit: '명' },
        edu_worker_count:  { label: '작업원 (명)',            type: 'number',   required: false, unit: '명' },
        supervisor_duties: {
          label: '작업지휘자 임무',
          type: 'multi-select',
          required: true,
          options: [
            '작업 지휘·감독',
            '이탈 시 대리 지정',
            '작업방법·근로자 배치 확인',
            '출입금지 조치',
            '안전대 등 보호구 착용상태 감시'
          ]
        },
        guide_duties: {
          label: '유도자 업무 확인',
          type: 'multi-select',
          required: false,
          options: [
            '운전원과 신호업무',
            '눈에 띄는 복장 착용',
            '무전기·유도봉 지참',
            '출입통제선 밖에 위치'
          ]
        }
      }
    },

    /* v0.2.0 신규 — 재해유형별 안전대책 DB (KOSHA GUIDE 8.) */
    accident_prevention: {
      label: '재해유형별 안전대책',
      hint: 'KOSHA GUIDE D-C-10-2026 기준 표준 대책. 현장에 맞게 수정 가능',
      type: 'accident_table',
      required: true,
      default_items: [
        {
          risk_type:  '중량물 인양',
          occurrence: '떨어짐',
          accident:   '고소작업자가 인양 중인 중량물에 맞고 떨어짐',
          measure:    '고소작업자 안전조치 철저 (안전난간, 추락방호망, 안전대)'
        },
        {
          risk_type:  '중량물 인양',
          occurrence: '떨어짐',
          accident:   '중량물과 함께 탑승한 작업자가 균형을 잃고 떨어짐',
          measure:    '인양함 등에 작업자 탑승 금지'
        },
        {
          risk_type:  '중량물 인양',
          occurrence: '맞음',
          accident:   '인양 중인 중량물이 떨어져 아래 작업자가 맞음',
          measure:    '중량물 2줄 걸이, 훅 해지장치 사용 / 정격하중 준수 / 인양구간 하부 출입금지'
        },
        {
          risk_type:  '크레인 넘어짐',
          occurrence: '깔림',
          accident:   '인양작업 중인 크레인이 전복되면서 주변 작업자가 깔림',
          measure:    '평평한 곳에 이동식 크레인 설치 / 아웃트리거 설치 및 지반 확인 / 정격하중 준수'
        },
        {
          risk_type:  '크레인 넘어짐',
          occurrence: '깔림',
          accident:   '선회부 볼트 일부 파단, 붐 파단으로 크레인이 넘어짐',
          measure:    '정기적으로 선회부 볼트 체결 확인 및 붐 등 용접부 비파괴검사 실시'
        },
        {
          risk_type:  '용도 외 사용',
          occurrence: '떨어짐',
          accident:   '이동식크레인을 고소작업용으로 사용하다가 작업자 떨어짐',
          measure:    '고소작업대 사용이 곤란한 경우에만 탑승설비 설치 후 고소작업용으로 사용 (차량탑재형 불가)'
        }
      ],
      custom_items: []
    }
  };

  /* ── schemas ── */
  var schemas = {

    /* 중장비 이용 작업계획서 */
    heavy_equipment: {
      label:   '중장비 이용 작업계획서',
      law_ref: '산업안전보건기준에 관한 규칙 제38조',
      sections: [
        { key: 'work_info',           ref: 'shared_fields.work_info'           },
        { key: 'equipment_basic',     ref: 'shared_fields.equipment_basic'     },
        { key: 'equipment_check',     ref: 'shared_fields.equipment_check'     },
        { key: 'supervisor_role',     ref: 'shared_fields.supervisor_role'     },
        { key: 'accident_prevention', ref: 'shared_fields.accident_prevention' }
      ]
    },

    /* 화물취급 작업계획서 */
    cargo_handling: {
      label:   '화물취급 작업계획서',
      law_ref: '산업안전보건기준에 관한 규칙 제177조',
      sections: [
        { key: 'work_info',           ref: 'shared_fields.work_info'           },
        { key: 'equipment_basic',     ref: 'shared_fields.equipment_basic'     },
        { key: 'equipment_check',     ref: 'shared_fields.equipment_check'     },
        { key: 'supervisor_role',     ref: 'shared_fields.supervisor_role'     },
        { key: 'accident_prevention', ref: 'shared_fields.accident_prevention' }
      ]
    },

    /* 중량물 취급 작업계획서 */
    heavy_object: {
      label:   '중량물 취급 작업계획서',
      law_ref: '산업안전보건기준에 관한 규칙 제38조, 제177조',
      sections: [
        { key: 'work_info',       ref: 'shared_fields.work_info'       },
        { key: 'equipment_basic', ref: 'shared_fields.equipment_basic' },
        {
          key:   'object_spec',
          label: '중량물 제원 및 인양 계획',
          fields: {
            object_name:   { label: '중량물명', type: 'text',   required: true          },
            object_weight: { label: '중량',     type: 'number', required: true,  unit: 't' },
            object_length: { label: '길이',     type: 'number', required: false, unit: 'm' },
            object_width:  { label: '너비',     type: 'number', required: false, unit: 'm' },
            object_height: { label: '높이',     type: 'number', required: false, unit: 'm' },
            /* v0.2.0 추가 */
            object_shape: {
              label: '중량물 형상',
              type: 'select',
              required: true,
              options: ['긴 막대형', '박스형', '비정형', '기타']
            },
            object_shape_note: { label: '형상 특이사항', type: 'text',        required: false },
            aux_tool: {
              label: '달기구 (보조용구)',
              type: 'multi-select',
              required: true,
              options: ['클램프', '해커', '체인슬링', '인양러그', '턴버클', '기타']
            },
            sling_method: {
              label: '줄걸이 방법',
              type: 'select',
              required: true,
              options: ['수직 1줄', '2줄 걸이', '4줄 걸이', '바스켓 걸이', '초크 걸이']
            },
            weight_center: {
              label: '무게중심 확인',
              type: 'select',
              required: true,
              options: ['확인완료', '확인필요', '해당없음']
            },
            work_sequence: {
              label: '작업순서 (절차)',
              type: 'textarea',
              required: true,
              hint: '인양 전 → 인양 중 → 거치 순서로 기재'
            }
          }
        },
        { key: 'equipment_check',     ref: 'shared_fields.equipment_check'     },
        { key: 'supervisor_role',     ref: 'shared_fields.supervisor_role'     },
        { key: 'accident_prevention', ref: 'shared_fields.accident_prevention' }
      ]
    }
  };

  /* ── machine_map ── */
  var machine_map = {
    tower_crane: {
      label:           '타워크레인',
      schema:          'heavy_equipment',
      icon:            'tower-crane',
      small_site_form: true
    },
    mobile_crane: {
      label:           '이동식 크레인',
      schema:          'heavy_object',
      icon:            'crane',
      small_site_form: true
    },
    forklift: {
      label:           '지게차',
      schema:          'cargo_handling',
      icon:            'forklift',
      small_site_form: true
    },
    excavator: {
      label:           '굴착기',
      schema:          'heavy_equipment',
      icon:            'excavator',
      small_site_form: true
    },
    aerial_work: {
      label:           '고소작업대',
      schema:          'heavy_equipment',
      icon:            'aerial-lift',
      small_site_form: true
    },
    cargo_truck: {
      label:           '화물자동차',
      schema:          'cargo_handling',
      icon:            'truck',
      small_site_form: true
    }
  };

  return {
    meta:          meta,
    shared_fields: shared_fields,
    schemas:       schemas,
    machine_map:   machine_map
  };

}());

/* ── 스모크 테스트 ── */
console.assert(
  MUSAI_PLAN.schemas.heavy_equipment &&
  MUSAI_PLAN.schemas.cargo_handling  &&
  MUSAI_PLAN.schemas.heavy_object    &&
  Object.keys(MUSAI_PLAN.machine_map).length >= 6 &&
  MUSAI_PLAN.shared_fields.equipment_check &&
  MUSAI_PLAN.shared_fields.supervisor_role &&
  MUSAI_PLAN.shared_fields.accident_prevention &&
  MUSAI_PLAN.shared_fields.accident_prevention.default_items.length >= 5,
  '[MUSAI_PLAN v0.2.0] 스키마 또는 신규 섹션 로드 실패'
);
