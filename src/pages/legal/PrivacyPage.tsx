import { Link } from "react-router-dom";
import type { ReactNode } from "react";

/**
 * 공고일·시행일. 배포 확정 시 동일 값으로 수정한다.
 * 사용자 화면 상단 시행일과 제15조 날짜가 일치하도록 이 상수만 사용한다.
 */
const PRIVACY_NOTICE_DATE = "2026년 9월 10일";
const PRIVACY_EFFECTIVE_DATE = "2026년 9월 10일";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-12">
      <h2 className="text-lg font-bold text-zinc-800">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

function Subhead({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 text-[15px] font-semibold text-zinc-800">{children}</h3>;
}

function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, index) => (
        <li key={index} className="break-words">
          {item}
        </li>
      ))}
    </ul>
  );
}

function DataTable({
  headers,
  rows,
  firstColClassName = "w-[7.5rem] min-w-[7.5rem] sm:w-[9rem] sm:min-w-[9rem]",
}: {
  headers: string[];
  rows: ReactNode[][];
  firstColClassName?: string;
}) {
  return (
    <div className="mt-2 -mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {headers.map((header, headerIndex) => (
              <th
                key={header}
                scope="col"
                className={`px-3 py-2.5 font-semibold text-zinc-800 ${
                  headerIndex === 0 ? firstColClassName : "min-w-[8rem]"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-200 align-top">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`break-words px-3 py-2.5 text-slate-700 ${
                    cellIndex === 0 ? firstColClassName : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="zt-container zt-section max-w-3xl">
      <h1 className="text-3xl font-bold text-zinc-800">개인정보처리방침</h1>
      <p className="mt-4 text-sm text-slate-500">시행일: {PRIVACY_EFFECTIVE_DATE}</p>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          주식회사 나루씨큐리티(이하 &quot;회사&quot;)는 「개인정보 보호법」 등 관련 법령을 준수하며,
          정보주체의 개인정보를 안전하게 처리하고 관련 권익을 보호하기 위하여 다음과 같이
          개인정보처리방침을 수립·공개합니다.
        </p>
        <p>본 개인정보처리방침은 ZeroTiCA 웹사이트에서 처리되는 개인정보에 적용됩니다.</p>
      </div>

      <Section id="purpose" title="1. 개인정보의 처리 목적">
        <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
        <Subhead>ZeroTiCA 도입 및 서비스 문의</Subhead>
        <BulletList
          items={[
            "ZeroTiCA 도입 문의 접수 및 확인",
            "문의 내용에 대한 상담 및 회신",
            "PoC, 견적, 서비스 도입 등 문의자가 요청한 사항에 대한 안내",
            "문의와 관련한 후속 상담 및 커뮤니케이션",
          ]}
        />
        <p>회사는 수집한 개인정보를 위 목적 이외의 용도로 이용하지 않습니다.</p>
        <p>처리 목적이 변경되는 경우 관련 법령에서 정한 절차에 따라 필요한 조치를 이행합니다.</p>
        <Subhead>브로슈어 및 데모</Subhead>
        <p>
          현재 ZeroTiCA 웹사이트에서 제공하는 브로슈어 다운로드 및 데모 체험은 별도의 개인정보 입력
          없이 이용할 수 있으며, 해당 기능 이용을 위해 개인정보를 별도로 수집하지 않습니다.
        </p>
        <p>
          향후 브로슈어 제공 또는 데모 이용 과정에서 이메일 등의 개인정보를 추가로 수집하는 경우,
          수집 화면 및 본 개인정보처리방침을 변경하여 안내합니다.
        </p>
      </Section>

      <Section id="items" title="2. 처리하는 개인정보의 항목">
        <p>회사는 ZeroTiCA 도입 문의 과정에서 다음 개인정보를 처리합니다.</p>
        <DataTable
          headers={["구분", "처리 항목", "이용 목적"]}
          rows={[
            ["필수", "업무 이메일, 문의 내용", "문의 접수, 상담 및 회신"],
            ["선택", "회사명, 담당자명, 연락처", "문의 내용 파악 및 원활한 상담"],
          ]}
        />
        <p>선택 항목은 입력하지 않아도 도입 문의를 접수할 수 있습니다.</p>
        <p>
          회사는 주민등록번호, 계정 비밀번호, 금융정보 등 서비스 상담에 필요하지 않은 민감정보 또는
          고유식별정보를 요구하지 않습니다.
        </p>
        <p>도입 문의 제출 시 개인정보 수집·이용에 관한 내용을 안내하고 정보주체의 동의를 받습니다.</p>
        <p>
          처리의 법적 근거는 「개인정보 보호법」 제15조제1항제1호에 따른 정보주체의 동의입니다.
        </p>
      </Section>

      <Section id="retention" title="3. 개인정보의 처리 및 보유기간">
        <p>회사는 개인정보를 처리 목적 달성에 필요한 기간 동안만 보유합니다.</p>
        <p>
          ZeroTiCA 도입 문의를 통해 수집한 개인정보는{" "}
          <strong className="font-semibold text-zinc-800">
            문의에 대한 상담 및 회신 완료일로부터 최대 6개월간 보관합니다.
          </strong>
        </p>
        <DataTable
          headers={["처리 업무", "보유기간"]}
          firstColClassName="w-[12rem] min-w-[12rem] sm:w-[14rem] sm:min-w-[14rem]"
          rows={[["ZeroTiCA 도입 및 서비스 문의", "상담 및 회신 완료일로부터 최대 6개월"]]}
        />
        <p>
          상담 및 회신 완료일은 해당 문의와 관련한 마지막 상담 또는 회신이 완료된 시점을 기준으로
          합니다.
        </p>
        <p>
          관계 법령에 따라 일정 기간 보존할 의무가 발생하는 경우에는 해당 법령에서 정한 기간 동안
          별도로 보관할 수 있습니다.
        </p>
      </Section>

      <Section id="processing" title="4. 도입 문의 개인정보의 처리 방식">
        <p>
          ZeroTiCA 웹사이트의 도입 문의 폼을 통해 입력한 정보는 문의 내용 확인 및 회신을 위해 회사의
          업무용 이메일 시스템으로 전달됩니다.
        </p>
        <p>개인정보 처리 흐름:</p>
        <p>
          사용자 브라우저
          <br />
          → ZeroTiCA 웹사이트
          <br />
          → AWS 기반 문의 API
          <br />
          → 업무용 이메일 시스템
          <br />→ ZeroTiCA 문의 수신 메일함
        </p>
        <p>회사는 도입 문의 정보를 별도의 고객 DB 또는 CRM에 저장하지 않습니다.</p>
        <p>
          문의 정보는 웹 문의 처리 과정에서 일시적으로 처리된 후 업무용 이메일 시스템으로 전달되며,
          최종적으로 업무용 이메일 시스템에서 보관·관리됩니다.
        </p>
        <p>
          현재 문의 API에서는 문의자의 이메일, 연락처, 이름, 문의내용 등 개인정보를 애플리케이션
          로그에 기록하지 않도록 운영하고 있습니다.
        </p>
      </Section>

      <Section id="third-party" title="5. 개인정보의 제3자 제공">
        <p>
          회사는 개인정보를 위 개인정보 처리 목적 범위 내에서 처리하며, 원칙적으로 정보주체의 동의
          없이 개인정보를 제3자에게 제공하지 않습니다.
        </p>
        <p>다만 다음의 경우 관련 법령에 따라 개인정보를 제공할 수 있습니다.</p>
        <BulletList
          items={[
            "정보주체가 제3자 제공에 별도로 동의한 경우",
            "법률에 특별한 규정이 있는 경우",
            "그 밖에 「개인정보 보호법」에서 허용하는 경우",
          ]}
        />
        <p>현재 ZeroTiCA 도입 문의 개인정보를 영업 또는 광고 목적으로 제3자에게 제공하지 않습니다.</p>
      </Section>

      <Section id="outsourcing" title="6. 개인정보 처리업무의 위탁">
        <p>
          회사는 ZeroTiCA 웹사이트 및 문의 기능 운영을 위해 필요한 범위에서 개인정보 처리업무의
          일부를 외부 전문사업자에게 위탁합니다.
        </p>
        <DataTable
          headers={["수탁자", "위탁 업무"]}
          firstColClassName="w-[11rem] min-w-[11rem] sm:w-[14rem] sm:min-w-[14rem]"
          rows={[
            [
              "Amazon Web Services Korea LLC",
              "ZeroTiCA 웹 문의 접수·전송을 위한 클라우드 인프라 운영",
            ],
            [
              "㈜다우기술",
              "업무용 이메일 시스템 운영 및 문의 이메일 보관",
            ],
          ]}
        />
        <p>
          ZeroTiCA 문의 API는 AWS 서울 리전에서 처리되며, 문의 개인정보를 별도의 AWS 데이터베이스나
          파일 저장소에 저장하지 않습니다.
        </p>
        <p>
          회사는 개인정보 처리업무를 위탁하는 경우 관련 법령에 따라 위탁 목적 외 개인정보 처리 금지,
          안전성 확보조치, 재위탁 관리 및 수탁자에 대한 관리·감독 등에 필요한 조치를 수행합니다.
        </p>
      </Section>

      <Section id="destruction" title="7. 개인정보의 파기 절차 및 방법">
        <p>
          회사는 개인정보의 보유기간이 경과하거나 처리 목적이 달성되어 개인정보가 더 이상 필요하지
          않게 된 경우 지체 없이 파기합니다.
        </p>
        <p>전자적 형태로 저장된 개인정보는 복구 또는 재생이 어렵도록 안전한 방법으로 삭제합니다.</p>
        <p>
          ZeroTiCA 도입 문의의 경우 업무용 이메일 시스템에 보관된 문의 이메일을{" "}
          <strong className="font-semibold text-zinc-800">
            월 1회 정기적으로 확인하고, 상담 및 회신 완료일로부터 6개월의 보유기간을 초과하지 않도록
            삭제합니다.
          </strong>
        </p>
        <p>
          종이 문서 형태의 개인정보가 존재하는 경우 분쇄 또는 소각 등 복구가 어려운 방법으로
          파기합니다.
        </p>
      </Section>

      <Section id="cookies" title="8. 쿠키 및 웹사이트 이용정보의 자동 수집">
        <p>
          회사는 웹사이트 이용 현황 분석을 위해 Google Analytics 4(GA4)를 사용하며, 관련 태그 관리를
          위해 Google Tag Manager(GTM)를 사용합니다.
        </p>
        <p>서비스 이용 과정에서 다음 정보가 자동으로 생성되거나 처리될 수 있습니다.</p>
        <BulletList
          items={[
            "방문 일시",
            "방문 페이지 및 이용 기록",
            "클릭, 데모 이용 등 서비스 상호작용 기록",
            "유입 경로",
            "브라우저 및 기기 관련 정보",
            "쿠키 및 온라인 식별정보",
            "대략적인 지역정보",
          ]}
        />
        <p>
          Google Analytics는 이용자와 세션을 구분하기 위해 <code className="text-[13px]">_ga</code>,{" "}
          <code className="text-[13px]">_ga_&lt;ID&gt;</code> 등의 퍼스트파티 쿠키를 사용할 수
          있습니다.
        </p>
        <DataTable
          headers={["쿠키", "목적", "기본 만료기간"]}
          rows={[
            ["_ga", "이용자 구분", "최대 2년"],
            ["_ga_<ID>", "세션 상태 유지", "최대 2년"],
          ]}
        />
        <p>실제 쿠키의 보존기간은 이용자의 브라우저 정책 및 설정에 따라 달라질 수 있습니다.</p>
        <p>
          이용자는 웹 브라우저의 개인정보 보호 및 보안 설정을 통해 쿠키 저장을 제한하거나 기존 쿠키를
          삭제할 수 있습니다.
        </p>
      </Section>

      <Section id="ga-tools" title="9. Google Analytics 및 제3자 자동수집도구 이용">
        <p>회사는 웹사이트 이용 통계 분석 및 서비스 개선을 위해 Google Analytics 4를 사용합니다.</p>
        <p>
          Google Analytics 이용 과정에서 Google LLC가 제공하는 자동수집도구를 통해 다음과 같은
          웹사이트 이용정보가 수집·처리될 수 있습니다.
        </p>
        <DataTable
          headers={["구분", "내용"]}
          firstColClassName="w-[10rem] min-w-[10rem] sm:w-[12rem] sm:min-w-[12rem]"
          rows={[
            ["수집도구", "Google Analytics 4"],
            ["수집 사업자", "Google LLC"],
            [
              "수집 항목",
              "쿠키 및 온라인 식별정보, 방문·이용 기록, 브라우저·기기 정보, 대략적인 지역정보",
            ],
            ["이용 목적", "웹사이트 이용 통계 분석 및 서비스 개선"],
            ["사용자·이벤트 수준 데이터 보유기간", "2개월"],
            ["거부 방법", "브라우저 쿠키 설정 또는 Google Analytics 차단 기능 이용"],
          ]}
        />
        <p>ZeroTiCA는 Google Analytics에 다음과 같은 직접 식별정보를 전송하지 않습니다.</p>
        <BulletList
          items={[
            "업무 이메일",
            "회사명",
            "담당자명",
            "연락처",
            "문의 내용",
            "로그인 User-ID 또는 계정 식별정보",
          ]}
        />
        <p>
          문의 폼과 관련해서는{" "}
          <code className="break-all text-[13px]">inquiry_form_start</code>,{" "}
          <code className="break-all text-[13px]">generate_lead</code> 등 문의 행동의 발생 여부만
          분석하며, 실제 문의 입력값은 Google Analytics로 전송하지 않습니다.
        </p>
        <p>현재 ZeroTiCA의 Google Analytics 운영 설정은 다음과 같습니다.</p>
        <BulletList
          items={[
            "사용자 및 이벤트 수준 데이터 보유기간: 2개월",
            "Google Signals: 비활성화",
            "Google Ads 연결: 없음",
            "광고 개인화 및 리타게팅: 미사용",
            "User-ID: 미사용",
          ]}
        />
        <p>
          Google Analytics 이용 과정에서 수집된 웹사이트 이용정보는 Google의 서비스 제공 인프라에서
          처리될 수 있습니다.
        </p>
        <p>
          원본 IP 주소는 대략적인 위치정보 산출 및 서비스 제공 과정에서 일시적으로 처리될 수 있으나,
          Google Analytics에 원본 IP 주소 그대로 저장되지는 않습니다.
        </p>
      </Section>

      <Section id="external" title="10. 외부 콘텐츠 및 서비스 이용">
        <Subhead>YouTube</Subhead>
        <p>서비스 영상 제공을 위해 YouTube 콘텐츠 및 YouTube IFrame API를 사용합니다.</p>
        <p>
          YouTube 콘텐츠를 불러오거나 재생하는 과정에서 Google 또는 YouTube가 쿠키 또는 온라인
          식별정보를 처리할 수 있습니다.
        </p>
        <Subhead>외부 CDN</Subhead>
        <p>웹사이트 화면에 필요한 폰트 및 정적 리소스 제공을 위해 외부 CDN을 사용할 수 있습니다.</p>
        <p>해당 CDN에 ZeroTiCA 도입 문의 폼에 입력한 개인정보를 전달하지 않습니다.</p>
      </Section>

      <Section id="browser-storage" title="11. 브라우저 저장정보">
        <p>
          ZeroTiCA 웹사이트는 서비스 이용 편의를 위해 개인정보가 포함되지 않은 브라우저 저장소를 일부
          사용합니다.
        </p>
        <DataTable
          headers={["저장 방식", "목적", "개인정보 포함 여부"]}
          firstColClassName="w-[9rem] min-w-[9rem] sm:w-[10rem] sm:min-w-[10rem]"
          rows={[
            ["localStorage", "데모 안내 팝업 재노출 여부 관리", "없음"],
            ["sessionStorage", "데모 진입 경로 구분", "없음"],
          ]}
        />
        <p>해당 저장정보에는 이메일, 이름, 전화번호 등 도입 문의 개인정보가 포함되지 않습니다.</p>
      </Section>

      <Section id="safeguards" title="12. 개인정보의 안전성 확보조치">
        <p>
          회사는 개인정보의 분실, 도난, 유출, 변조 또는 훼손을 방지하기 위해 필요한 관리적·기술적
          보호조치를 시행합니다.
        </p>
        <Subhead>개인정보 최소수집</Subhead>
        <BulletList
          items={["업무 이메일과 문의 내용만 필수 입력", "회사명, 담당자명, 연락처는 선택 입력"]}
        />
        <Subhead>저장 최소화</Subhead>
        <BulletList
          items={["별도 고객 DB 및 CRM 미운영", "문의 개인정보를 웹 분석 도구에 전송하지 않음"]}
        />
        <Subhead>전송 및 시스템 보호</Subhead>
        <BulletList
          items={[
            "HTTPS/TLS 기반 암호화 통신",
            "문의 데이터는 AWS 기반 시스템에서 일시적으로 처리 후 업무용 이메일 시스템으로 전달",
          ]}
        />
        <Subhead>로그 최소화</Subhead>
        <BulletList
          items={[
            "문의자의 이메일, 전화번호, 이름, 문의내용 등 개인정보가 포함된 애플리케이션 로그 생성을 최소화",
            "문의 요청 body를 애플리케이션 로그에 기록하지 않도록 운영",
          ]}
        />
        <Subhead>접근권한 관리</Subhead>
        <BulletList
          items={[
            "문의 이메일은 업무상 필요한 담당자만 접근하도록 관리",
            "조직 이동 또는 업무 변경 시 불필요한 접근권한을 회수",
          ]}
        />
      </Section>

      <Section id="rights" title="13. 정보주체의 권리 및 행사방법">
        <p>
          정보주체는 관계 법령에서 정하는 바에 따라 자신의 개인정보에 대해 다음 권리를 행사할 수
          있습니다.
        </p>
        <BulletList
          items={[
            "개인정보 열람 요구",
            "개인정보 정정·삭제 요구",
            "개인정보 처리정지 요구",
            "개인정보 수집·이용 동의 철회 등",
          ]}
        />
        <p>
          권리 행사는 개인정보 보호책임자 또는 담당부서를 통해 이메일, 전화 또는 서면 등의 방법으로
          요청할 수 있습니다.
        </p>
        <p>권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통해서도 할 수 있습니다.</p>
        <p>회사는 정보주체의 요청을 확인한 후 관련 법령에 따라 필요한 조치를 취합니다.</p>
      </Section>

      <Section id="contact" title="14. 개인정보 보호책임자 및 문의처">
        <p>
          회사는 개인정보 처리와 관련한 정보주체의 문의, 불만처리 및 권리 행사를 지원하기 위해
          개인정보 보호책임자 및 담당부서를 운영합니다.
        </p>
        <Subhead>개인정보 보호책임자</Subhead>
        <BulletList items={["성명: ", "직책: "]} />
        <Subhead>개인정보 보호 담당부서</Subhead>
        <BulletList
          items={[
            "부서명: ",
            "이메일: ",
            "전화번호: 02-522-7912",
            "주소: 서울특별시 송파구 중대로 97, 6층",
          ]}
        />
      </Section>

      {/*
        TODO: 이전 개인정보처리방침 원문/라우트가 코드베이스에 생기면
        제15조 하단에 이전 버전 확인 링크를 연결한다.
        현재는 /legal/privacy 단일 페이지만 존재하며 archived 원문이 없다.
      */}
      <Section id="changes" title="15. 개인정보처리방침의 변경">
        <p>
          본 개인정보처리방침은 관련 법령, 회사 정책 또는 ZeroTiCA 웹사이트의 개인정보 처리 방식이
          변경되는 경우 수정될 수 있습니다.
        </p>
        <p>개인정보처리방침이 변경되는 경우 ZeroTiCA 웹사이트를 통해 변경 내용을 안내합니다.</p>
        <BulletList
          items={[`공고일: ${PRIVACY_NOTICE_DATE}`, `시행일: ${PRIVACY_EFFECTIVE_DATE}`]}
        />
      </Section>

      <Link to="/" className="zt-btn-ghost mt-10">
        홈으로
      </Link>
    </div>
  );
}
