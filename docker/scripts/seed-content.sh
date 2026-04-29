#!/bin/sh
# Page Content Seeder for xFact WordPress Theme.
#
# Removes default content, creates pages, sets static front page,
# and populates each page's post_content with the appropriate block markup.
# Called by setup.sh.
#
# Usage: sh seed-content.sh

set -eu

echo "📝 Seeding page content..."

: "${WP_SITE_URL:?missing}"

# Theme assets base URL — used for image attributes.
SITE_URL=$(wp option get siteurl 2>/dev/null || echo "$WP_SITE_URL")
ASSETS="${SITE_URL}/wp-content/themes/xfact/assets/images"

# Remove default content
echo "🧹 Cleaning up default content..."
wp post delete 1 --force 2>/dev/null || true    # Hello World
wp post delete 2 --force 2>/dev/null || true    # Sample Page
wp comment delete 1 --force 2>/dev/null || true # Default comment

# Create theme pages (slugs must match template filenames: page-{slug}.html)
echo "📄 Creating theme pages..."
for page_info in \
    "Home:home" \
    "About:about" \
    "Capabilities:capabilities" \
    "News & Insights:news" \
    "Solutions:solutions" \
    "Support:support" \
    "Careers:careers" \
    "Contact:contact" \
    "Privacy Policy:privacy" \
    "Terms of Service:terms"; do
    title="${page_info%%:*}"
    slug="${page_info##*:}"
    if ! wp post list --post_type=page --name="$slug" --field=ID 2>/dev/null | grep -q .; then
        wp post create --post_type=page --post_title="$title" --post_name="$slug" --post_status=publish
        echo "  ✅ Created page: $title ($slug)"
    else
        echo "  ✅ Page exists: $title ($slug)"
    fi
done

# Set static front page
FRONT_PAGE_ID=$(wp post list --post_type=page --name=home --field=ID 2>/dev/null)
if [ -n "$FRONT_PAGE_ID" ]; then
    wp option update show_on_front page
    wp option update page_on_front "$FRONT_PAGE_ID"
    echo "  ✅ Front page set to: Home (ID $FRONT_PAGE_ID)"


# Set up Solutions Subpages
SOL_ID=$(wp post list --post_type=page --name=solutions --field=ID 2>/dev/null)
if [ -n "$SOL_ID" ]; then
    for sub_info in \
        "Public Safety & Justice:public-safety" \
        "Municipal, State & Local Government:government" \
        "Education:education" \
        "Health & Human Services:health-human-services" \
        "Infrastructure & Managed Services:infrastructure"; do
        sub_title="${sub_info%%:*}"
        sub_slug="${sub_info##*:}"
        if ! wp post list --post_type=page --name="$sub_slug" --field=ID 2>/dev/null | grep -q .; then
            wp post create --post_type=page --post_title="$sub_title" --post_name="$sub_slug" --post_parent="$SOL_ID" --post_status=publish
            echo "  ✅ Created subpage: $sub_title ($sub_slug)"
        fi
    done
fi
echo "📝 Adding block markup..."

# ── Home ──────────────────────────────────────────────────────
HOME_ID=$(wp post list --post_type=page --name=home --field=ID 2>/dev/null)
if [ -n "$HOME_ID" ]; then
    wp post update "$HOME_ID" --post_content='<!-- wp:xfact/hero {"align":"full","slides":[{"src":"'"${ASSETS}"'/hero-solutions.jpg","alt":"Healthcare workers collaborating","position":"65% 30%"},{"src":"'"${ASSETS}"'/hero-contact.jpg","alt":"Students using technology","position":"center 35%"},{"src":"'"${ASSETS}"'/hero-careers.jpg","alt":"Volunteers working together","position":"center 30%"},{"src":"'"${ASSETS}"'/hero-support.jpg","alt":"Public safety operations","position":"70% 30%"}],"posterImage":"'"${ASSETS}"'/xfact-hero-poster.png","videoUrl":"'"${ASSETS}"'/xfact-hero.mp4"} /-->

<!-- wp:xfact/text-section {"sectionLabel":"Our Promise","heading":"One Partner. Complete Accountability.","body":"Public institutions depend on technology that cannot fail — systems that must remain continuously secure, stable, and available, often across fragmented environments built on legacy infrastructure and multiple vendors. xFact exists to bring those environments together: We integrate, secure, and sustain mission-critical systems under one accountable partnership — so the institutions that serve communities can focus on their mission, not their infrastructure."} /-->

<!-- wp:xfact/solutions-grid {"sectors":[{"title":"Public safety \u0026 justice","headline":"Law enforcement, courts, corrections, 911 systems","description":"Mission-critical systems that require continuous availability and uncompromising security.","iconName":"Shield","href":"/solutions#public-safety"},{"title":"Government \u0026 municipal","headline":"State, county, and local agencies","description":"Integrated systems that support public works, digital services, and civic infrastructure.","iconName":"Landmark","href":"/solutions#government"},{"title":"Education","headline":"K-12 districts and higher education","description":"Secure infrastructure that protects student data and supports continuous learning.","iconName":"GraduationCap","href":"/solutions#education"},{"title":"Health \u0026 human services","headline":"Healthcare, behavioral health, social services","description":"Compliant environments that balance accessibility with strict privacy requirements.","iconName":"HeartPulse","href":"/solutions#health-human-services"},{"title":"Infrastructure \u0026 managed services","headline":"DataServ, an xFact solution","description":"Hosted platforms and managed network operations that ensure operational stability.","iconName":"ServerCog","badge":"DataServ","href":"/solutions#infrastructure"}]} /-->

<!-- wp:xfact/capabilities-pipeline /-->

<!-- wp:xfact/metrics-strip {"align":"full"} /-->

<!-- wp:xfact/text-section {"sectionLabel":"DataServ Integration","heading":"Trusted Services, Expanded Capabilities","badgeText":"● Formerly DataServ","body":"DataServ has delivered managed IT, cloud, and cybersecurity services to K-12 schools, municipalities, and businesses for years. That experience — and the team behind it — is now part of xFact, giving clients access to a wider range of capabilities without changing the relationships they rely on.","tags":[{"label":"Managed IT","iconName":"Monitor"},{"label":"Cloud services","iconName":"Cloud"},{"label":"Cybersecurity","iconName":"ShieldCheck"},{"label":"K-12 schools","iconName":"School"},{"label":"Municipalities","iconName":"Building2"},{"label":"Senior loan \u0026 contacts","iconName":"Users"}]} /-->

<!-- wp:xfact/logo-strip /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to talk about your systems?","subtitle":"Whether you'\''re planning an upgrade, responding to a requirement, or evaluating a long-term partner — we'\''re the right conversation to start.","primaryLabel":"Contact xFact","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: Home"
fi

# ── About ─────────────────────────────────────────────────────
ABT_ID=$(wp post list --post_type=page --name=about --field=ID 2>/dev/null)
if [ -n "$ABT_ID" ]; then
    wp post update "$ABT_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"About xFact","heading":"Behind the Systems Communities Rely On","subtitle":"For more than two decades, xFact has partnered with public-sector institutions to design, integrate, secure, and sustain mission-critical technology systems.","align":"full"} /-->

<!-- wp:xfact/text-section {"sectionLabel":"Our Story","heading":"Our Story","body":"xFact began as a public-sector technology services firm focused on helping state, local, and education organizations modernize the systems their communities depend on. Over time, that work expanded across infrastructure, cybersecurity, applications, and strategy — and DataServ joined as our infrastructure and managed-services platform. Today, xFact operates as a single accountable partner for the institutions behind public safety, government, education, and human services."} /-->

<!-- wp:xfact/text-section {"sectionLabel":"Why We Do It","heading":"Why We Do It","body":"Public institutions rely on technology systems that must work every day. Many of those environments have evolved across multiple vendors, platforms, and legacy systems — creating fragmentation and operational risk. We exist to bring those environments together: integrated, accountable, and sustained over time so communities receive uninterrupted service."} /-->

<!-- wp:xfact/feature-cards {"sectionLabel":"How We Operate","heading":"What partnership with xFact looks like","cards":[{"title":"Long-term accountability","description":"We stay with our clients across the full lifecycle of their systems — from design through ongoing operation.","iconName":"ShieldCheck"},{"title":"One coordinated system","description":"We bring infrastructure, security, applications, and strategy together so environments operate as one — not as a collection of disconnected services.","iconName":"Network"},{"title":"Mission-aligned delivery","description":"Every project we ship supports a public-sector mission. We build for reliability, governance, and the people communities depend on.","iconName":"HeartPulse"},{"title":"Real partnership","description":"We work alongside our clients, not at arm'\''s length. That means clear communication, honest tradeoff conversations, and shared success metrics.","iconName":"Users"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to talk about your systems?","subtitle":"Whether you'\''re planning an upgrade, evaluating a long-term partner, or starting an assessment — we'\''re the right conversation to start.","primaryLabel":"Contact xFact","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: About"
fi

# ── Capabilities ────────────────────────────────────────────────
CAP_ID=$(wp post list --post_type=page --name=capabilities --field=ID 2>/dev/null)
if [ -n "$CAP_ID" ]; then
    wp post update "$CAP_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Capabilities","heading":"Integrated Capabilities for Mission-Critical Systems","subtitle":"Coordinated expertise supporting systems across their full lifecycle — from idea to action, design through long-term operation.","align":"full"} /-->

<!-- wp:xfact/text-section {"sectionLabel":"Idea to Action","heading":"A Full-Funnel Capabilities Stack","body":"Public-sector environments require integrated expertise across infrastructure, security, applications, and strategy. xFact delivers coordinated, system-level solutions that align with governance and operational realities. Support extends from design through long-term operation."} /-->

<!-- wp:xfact/capability-areas {"areas":[
  {"title":"Strategy & Advisory","headline":"Where it starts: governance-aware strategy and planning that ensure systems evolve responsibly over time.","body":"We help leaders shape technology direction in environments that demand stability, governance, and accountability. Our advisory work translates strategic intent into a practical roadmap that respects budget cycles, procurement rules, and the realities of running essential services.","iconName":"Compass","anchor":"strategy-advisory","services":["Technology assessments & roadmaps","Architecture & enterprise planning","Governance & risk strategy","Procurement & vendor advisory"]},
  {"title":"Applications & Integration","headline":"Connected applications and systems designed to operate reliably as one coordinated environment.","body":"We design, build, and integrate applications that connect across the systems public institutions already rely on. The result is fewer silos, less duplication, and a coordinated environment that scales with the mission.","iconName":"AppWindow","anchor":"applications-integration","services":["Custom application development","System integration & APIs","Workflow & case-management platforms","Modernization of legacy applications"]},
  {"title":"Data & Platforms","headline":"Structured, secure data environments that enable visibility, coordination, and informed decision-making.","body":"Our data work focuses on giving leaders a trustworthy picture of their environments. We build platforms that move sensitive data safely, structure it for accountability, and surface it where decisions are made.","iconName":"Database","anchor":"data-platforms","services":["Data platform design","Reporting, analytics & dashboards","Data governance & lineage","Master data & integration patterns"]},
  {"title":"Cybersecurity","headline":"Coordinated protection and monitoring that keeps systems secure without disrupting essential operations.","body":"Security in public-sector environments is a continuous practice, not a project. We design defenses that account for compliance requirements, monitor environments around the clock, and respond when something matters.","iconName":"ShieldCheck","anchor":"cybersecurity","services":["Security architecture & assessments","Compliance (CJIS, HIPAA, FedRAMP, etc.)","24x7 managed detection & response","Incident response & recovery"]},
  {"title":"Infrastructure & Platform Environments","headline":"Resilient environments that ensure mission-critical systems remain secure, stable, and continuously operational.","body":"Our infrastructure practice — delivered through DataServ, an xFact solution — provides the resilient foundation public institutions need to operate essential systems with confidence.","iconName":"ServerCog","anchor":"infrastructure","services":["Hybrid & cloud infrastructure","Hosted platform environments (DataServ)","Network & telecommunications","Managed services & monitoring"]}
]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Bring it all together.","subtitle":"Talk to us about coordinating your environments under one accountable partner.","primaryLabel":"Start a conversation","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: Capabilities"
fi

# ── News ──────────────────────────────────────────────────────
NEWS_ID=$(wp post list --post_type=page --name=news --field=ID 2>/dev/null)
if [ -n "$NEWS_ID" ]; then
    wp post update "$NEWS_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"News \u0026 Insights","heading":"News \u0026 Insights","subtitle":"Perspectives on public-sector systems and the technology behind them.","backgroundImage":"'"${ASSETS}"'/hero-solutions.jpg","imageAlt":"A workspace with laptop and notes","align":"full"} /-->

<!-- wp:xfact/text-section {"sectionLabel":"Stories from xFact","body":"Technology environments continue to evolve. We publish field-level insights on what we see across public safety, government, education, and human services — grounded in real-world engagements rather than vendor talking points."} /-->

<!-- wp:xfact/text-section {"useAltBackground":true,"isCenteredCard":true,"sectionLabel":"New stories on the way","heading":"Stay Tuned","body":"We'\''re reorganizing the DataServ archive into a unified news feed. Check back shortly — or reach out if you'\''d like to talk to us in the meantime."} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Want to talk shop?","subtitle":"We share insights privately, too. Reach out and we can dive in on your environment.","primaryLabel":"Contact us","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: News"
fi

# ── Solutions ─────────────────────────────────────────────────
SOL_ID=$(wp post list --post_type=page --name=solutions --field=ID 2>/dev/null)
if [ -n "$SOL_ID" ]; then
    wp post update "$SOL_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Solutions","heading":"Reliable Systems. Stronger Communities.","subtitle":"xFact supports mission-critical systems across complex public-sector environments. A single accountable partner improves reliability and reduces complexity.","backgroundImage":"'"${ASSETS}"'/hero-solutions.jpg","imageAlt":"Healthcare workers collaborating","align":"full"} /-->

<!-- wp:xfact/solutions-grid {"sectionLabel":"Industries we support","heading":"Purpose-Built for Public-Sector Environments","subtitle":"Each industry has its own systems, governance, and accountability demands. Tap into the area that matters to your work.","sectors":[{"title":"Public Safety \u0026 Justice","headline":"Strengthening Systems That Cannot Fail","description":"Public safety agencies operate in environments where technology reliability is critical to real-time operations. Communications infrastructure and secure information environments must remain continuously available while meeting stringent security and compliance requirements.","iconName":"Shield","href":"/solutions/public-safety"},{"title":"Municipal, State \u0026 Local Government","headline":"Coordinating Systems That Support Communities","description":"State, municipal, and county governments rely on interconnected systems that support essential community services. From public works and administrative operations to digital services and civic infrastructure, these systems must remain secure, resilient, and continuously operational.","iconName":"Landmark","href":"/solutions/government"},{"title":"Education","headline":"Supporting Learning Through Reliable Systems","description":"Educational institutions manage interconnected systems that range from student information and learning management to operational infrastructure.","iconName":"GraduationCap","href":"/solutions/education"},{"title":"Health \u0026 Human Services","headline":"Supporting Systems That Serve Communities","description":"Health and human services agencies manage systems that must simultaneously ensure accessibility for constituents and comply with stringent privacy requirements.","iconName":"HeartPulse","href":"/solutions/health-human-services"},{"title":"Infrastructure \u0026 Managed Services","headline":"Resilient Infrastructure for Mission-Critical Systems","description":"We provide secure infrastructure environments designed to support the continuous operation of mission-critical public systems, delivering the stability, performance, and security required in high-accountability environments.","iconName":"ServerCog","badge":"DataServ","href":"/solutions/infrastructure"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to strengthen your systems?","subtitle":"Schedule an assessment to understand your current environment and identify a path forward.","primaryLabel":"Contact Us","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: Solutions"
fi

# ── Solutions Subpages ────────────────────────────────────────
if [ -n "$SOL_ID" ]; then
    # Public Safety
    SUB_ID=$(wp post list --post_type=page --name=public-safety --field=ID 2>/dev/null)
    if [ -n "$SUB_ID" ]; then
        wp post update "$SUB_ID" --post_content='<!-- wp:xfact/page-hero {"heading":"Strengthening Systems That Cannot Fail","subtitle":"Supporting real-time operations where reliability is critical.","bodyText":"Public safety agencies operate in environments where technology reliability is critical to real-time operations. Communications infrastructure and secure information environments must remain continuously available while meeting stringent security and compliance requirements.","useBreadcrumbs":true,"align":"full"} /-->

<!-- wp:xfact/text-section {"sectionIcon":"Shield","sectionLabel":"Public Safety \u0026 Justice","body":"xFact helps public safety organizations maintain resilient and secure technology environments that support mission-critical operations and ensure systems remain dependable in high-consequence situations.","keyMessages":["Public safety systems operate in high-consequence environments.","Systems must meet strict security and compliance requirements.","xFact ensures systems remain secure, integrated, and continuously available.","Coordinated systems support dependable public safety outcomes."]} /-->

<!-- wp:xfact/case-study-grid {"sectionLabel":"Case Studies","heading":"Proof in Public Safety","description":"Engagements where xFact has helped public-sector teams strengthen the systems behind their work.","items":[{"title":"Public Safety Data Broker Solution","summary":"Coordinated data brokerage platform connecting law-enforcement systems while preserving security and compliance.","source":"xFact","linkUrl":"/public-safety-data-broker/"},{"title":"License Management System","summary":"Modernized licensing workflows for a state public-safety agency, replacing legacy paper-based processes with secure digital ones.","source":"xFact","linkUrl":"/license-management-system/"},{"title":"Cloud Migration Strategic Roadmap","summary":"A phased cloud-migration plan that preserved real-time availability for mission-critical public-safety operations.","source":"xFact","linkUrl":"/cloud-migration-strategic-roadmap/"}]} /-->

<!-- wp:xfact/navigation-cards {"heading":"Relevant Capabilities","buttonLabel":"See all capabilities →","buttonHref":"/capabilities","items":[{"title":"Cybersecurity","subtitle":"Proactive defense for sensitive environments.","icon":"ShieldCheck","href":"/capabilities#cybersecurity"},{"title":"Infrastructure \u0026 Platform Environments","subtitle":"Resilient environments for mission-critical systems.","icon":"ServerCog","href":"/capabilities#infrastructure"},{"title":"Applications \u0026 Integration","subtitle":"Connecting systems for unified operations.","icon":"AppWindow","href":"/capabilities#applications-integration"}]} /-->

<!-- wp:xfact/navigation-cards {"heading":"Other Industries","items":[{"title":"Municipal, State \u0026 Local Government","icon":"Landmark","href":"/solutions/government"},{"title":"Education","icon":"GraduationCap","href":"/solutions/education"},{"title":"Health \u0026 Human Services","icon":"HeartPulse","href":"/solutions/health-human-services"},{"title":"Infrastructure \u0026 Managed Services","icon":"ServerCog","href":"/solutions/infrastructure"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to strengthen your systems?","subtitle":"Schedule an assessment to understand your current environment and identify a path forward.","primaryLabel":"Contact Us","primaryHref":"/contact"} /-->'
        echo "  ✅ Seeded Subpage: Public Safety"
    fi

    # Government
    SUB_ID=$(wp post list --post_type=page --name=government --field=ID 2>/dev/null)
    if [ -n "$SUB_ID" ]; then
        wp post update "$SUB_ID" --post_content='<!-- wp:xfact/page-hero {"heading":"Coordinating Systems That Support Communities","subtitle":"Supporting reliable technology environments across government operations.","bodyText":"State, municipal, and county governments rely on interconnected systems that support essential community services. From public works and administrative operations to digital services and civic infrastructure, these systems must remain secure, resilient, and continuously operational.","useBreadcrumbs":true,"align":"full"} /-->

<!-- wp:xfact/text-section {"sectionIcon":"Landmark","sectionLabel":"Municipal, State \u0026 Local Government","body":"xFact helps state and local governments strengthen and coordinate these technology environments so departments can operate reliably, manage growing complexity, and sustain the services communities depend on.","keyMessages":["Government systems must operate reliably across departments and services.","Fragmentation and governance requirements increase complexity.","xFact integrates and modernizes systems while maintaining stability.","Long-term partnership supports consistent service delivery."]} /-->

<!-- wp:xfact/case-study-grid {"sectionLabel":"Case Studies","heading":"Proof in Municipal, State","description":"Engagements where xFact has helped public-sector teams strengthen the systems behind their work.","items":[{"title":"Public Safety Data Broker Solution","summary":"A high-volume, fault-tolerant message broker enabling standardized criminal-justice information sharing across state, federal, and international systems.","source":"xFact","linkUrl":"/public-safety-data-broker/"},{"title":"License Management System","summary":"A modular firearms-licensing platform rolled out across 350+ local police departments and all state-licensed firearms dealers — the first solution of its kind in the USA.","source":"xFact","linkUrl":"/license-management-system/"},{"title":"Cloud Migration Strategic Roadmap","summary":"A comprehensive cloud migration roadmap and serverless architecture recommendations for a major criminal-justice agency, meeting FedRAMP High and CJIS compliance.","source":"xFact","linkUrl":"/cloud-migration-strategic-roadmap/"}]} /-->

<!-- wp:xfact/navigation-cards {"heading":"Relevant Capabilities","buttonLabel":"See all capabilities →","buttonHref":"/capabilities","items":[{"title":"Infrastructure \u0026 Platform Environments","subtitle":"Resilient environments for mission-critical systems.","icon":"ServerCog","href":"/capabilities#infrastructure"},{"title":"Data \u0026 Analytics Platforms","subtitle":"Actionable insights from complex data.","icon":"Database","href":"/capabilities#data-platforms"},{"title":"Strategy \u0026 Advisory","subtitle":"Aligning technology with operational goals.","icon":"Compass","href":"/capabilities#strategy-advisory"}]} /-->

<!-- wp:xfact/navigation-cards {"heading":"Other Industries","items":[{"title":"Public Safety \u0026 Justice","icon":"Shield","href":"/solutions/public-safety"},{"title":"Education","icon":"GraduationCap","href":"/solutions/education"},{"title":"Health \u0026 Human Services","icon":"HeartPulse","href":"/solutions/health-human-services"},{"title":"Infrastructure \u0026 Managed Services","icon":"ServerCog","href":"/solutions/infrastructure"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to strengthen your systems?","subtitle":"Schedule an assessment to understand your current environment and identify a path forward.","primaryLabel":"Contact Us","primaryHref":"/contact"} /-->'
        echo "  ✅ Seeded Subpage: Government"
    fi

    # Education
    SUB_ID=$(wp post list --post_type=page --name=education --field=ID 2>/dev/null)
    if [ -n "$SUB_ID" ]; then
        wp post update "$SUB_ID" --post_content='<!-- wp:xfact/page-hero {"heading":"Supporting Learning Through Reliable Systems","subtitle":"Helping K-12 schools maintain secure, stable technology environments.","bodyText":"Educational institutions manage interconnected systems that range from student information and learning management to operational infrastructure.","useBreadcrumbs":true,"align":"full"} /-->

<!-- wp:xfact/text-section {"sectionIcon":"GraduationCap","sectionLabel":"Education","body":"xFact helps school systems maintain stable, secure infrastructure that supports educators, protects student data, and enables technology environments to evolve responsibly without disrupting the learning experience.","keyMessages":["Schools rely on systems for instruction, operations, and student services.","Systems must remain available while adapting to evolving needs.","xFact supports secure, reliable environments that protect student data.","Technology evolves without disrupting learning experiences."]} /-->

<!-- wp:xfact/navigation-cards {"heading":"Relevant Capabilities","buttonLabel":"See all capabilities →","buttonHref":"/capabilities","items":[{"title":"Infrastructure \u0026 Platform Environments","subtitle":"Resilient environments for mission-critical systems.","icon":"ServerCog","href":"/capabilities#infrastructure"},{"title":"Cybersecurity","subtitle":"Proactive defense for sensitive environments.","icon":"ShieldCheck","href":"/capabilities#cybersecurity"},{"title":"Applications \u0026 Integration","subtitle":"Connecting systems for unified operations.","icon":"AppWindow","href":"/capabilities#applications-integration"}]} /-->

<!-- wp:xfact/navigation-cards {"heading":"Other Industries","items":[{"title":"Public Safety \u0026 Justice","icon":"Shield","href":"/solutions/public-safety"},{"title":"Municipal, State \u0026 Local Government","icon":"Landmark","href":"/solutions/government"},{"title":"Health \u0026 Human Services","icon":"HeartPulse","href":"/solutions/health-human-services"},{"title":"Infrastructure \u0026 Managed Services","icon":"ServerCog","href":"/solutions/infrastructure"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to strengthen your systems?","subtitle":"Schedule an assessment to understand your current environment and identify a path forward.","primaryLabel":"Contact Us","primaryHref":"/contact"} /-->'
        echo "  ✅ Seeded Subpage: Education"
    fi

    # HHS
    SUB_ID=$(wp post list --post_type=page --name=health-human-services --field=ID 2>/dev/null)
    if [ -n "$SUB_ID" ]; then
        wp post update "$SUB_ID" --post_content='<!-- wp:xfact/page-hero {"heading":"Supporting Systems That Serve Communities","subtitle":"Strengthening systems that support critical programs and services.","bodyText":"Health and human services agencies manage systems that must simultaneously ensure accessibility for constituents and comply with stringent privacy requirements.","useBreadcrumbs":true,"align":"full"} /-->

<!-- wp:xfact/text-section {"sectionIcon":"HeartPulse","sectionLabel":"Health \u0026 Human Services","body":"xFact helps health and human services agencies maintain stable, secure technology environments that support essential programs, protect sensitive information, and ensure systems operate reliably in complex regulatory environments.","keyMessages":["HHS systems support essential services for individuals and communities.","Systems must balance accessibility, privacy, and compliance.","xFact ensures systems remain secure, stable, and reliable.","Long-term partnership supports sustained program delivery."]} /-->

<!-- wp:xfact/case-study-grid {"sectionLabel":"Case Studies","heading":"Proof in Health","description":"Engagements where xFact has helped public-sector teams strengthen the systems behind their work.","items":[{"title":"HHS Child Welfare Case Management System Modernization","summary":"Modernization of a state child-welfare case-management platform, replacing siloed legacy tooling with an integrated system.","source":"xFact"},{"title":"Healthcare Operations Optimization","summary":"Operational and infrastructure improvements for a regional healthcare provider, focused on reliability and continuous availability.","source":"DataServ"}]} /-->

<!-- wp:xfact/navigation-cards {"heading":"Relevant Capabilities","buttonLabel":"See all capabilities →","buttonHref":"/capabilities","items":[{"title":"Cybersecurity","subtitle":"Proactive defense for sensitive environments.","icon":"ShieldCheck","href":"/capabilities#cybersecurity"},{"title":"Data \u0026 Analytics Platforms","subtitle":"Actionable insights from complex data.","icon":"Database","href":"/capabilities#data-platforms"},{"title":"Applications \u0026 Integration","subtitle":"Connecting systems for unified operations.","icon":"AppWindow","href":"/capabilities#applications-integration"}]} /-->

<!-- wp:xfact/navigation-cards {"heading":"Other Industries","items":[{"title":"Public Safety \u0026 Justice","icon":"Shield","href":"/solutions/public-safety"},{"title":"Municipal, State \u0026 Local Government","icon":"Landmark","href":"/solutions/government"},{"title":"Education","icon":"GraduationCap","href":"/solutions/education"},{"title":"Infrastructure \u0026 Managed Services","icon":"ServerCog","href":"/solutions/infrastructure"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to strengthen your systems?","subtitle":"Schedule an assessment to understand your current environment and identify a path forward.","primaryLabel":"Contact Us","primaryHref":"/contact"} /-->'
        echo "  ✅ Seeded Subpage: HHS"
    fi

    # Infrastructure
    SUB_ID=$(wp post list --post_type=page --name=infrastructure --field=ID 2>/dev/null)
    if [ -n "$SUB_ID" ]; then
        wp post update "$SUB_ID" --post_content='<!-- wp:xfact/page-hero {"heading":"Resilient Infrastructure for Mission-Critical Systems","bodyText":"We provide secure infrastructure environments designed to support the continuous operation of mission-critical public systems, delivering the stability, performance, and security required in high-accountability environments.","badgeText":"DataServ, an xFact solution","useBreadcrumbs":true,"align":"full"} /-->

<!-- wp:xfact/text-section {"sectionIcon":"ServerCog","sectionLabel":"Infrastructure \u0026 Managed Services","badgeText":"DataServ, an xFact solution","body":"We provide secure infrastructure environments designed to support the continuous operation of mission-critical public systems, delivering the stability, performance, and security required in high-accountability environments.","keyMessages":["Mission-critical systems require continuously available platforms.","High-accountability environments demand stability, performance, and security.","Resilient foundations support responsible modernization over time.","A single accountable partner reduces operational risk."]} /-->

<!-- wp:xfact/navigation-cards {"heading":"Relevant Capabilities","buttonLabel":"See all capabilities →","buttonHref":"/capabilities","items":[{"title":"Infrastructure \u0026 Platform Environments","subtitle":"Resilient environments for mission-critical systems.","icon":"ServerCog","href":"/capabilities#infrastructure"},{"title":"Cybersecurity","subtitle":"Proactive defense for sensitive environments.","icon":"ShieldCheck","href":"/capabilities#cybersecurity"}]} /-->

<!-- wp:xfact/navigation-cards {"heading":"Other Industries","items":[{"title":"Public Safety \u0026 Justice","icon":"Shield","href":"/solutions/public-safety"},{"title":"Municipal, State \u0026 Local Government","icon":"Landmark","href":"/solutions/government"},{"title":"Education","icon":"GraduationCap","href":"/solutions/education"},{"title":"Health \u0026 Human Services","icon":"HeartPulse","href":"/solutions/health-human-services"}]} /-->

<!-- wp:xfact/cta-section {"align":"full","title":"Ready to strengthen your systems?","subtitle":"Schedule an assessment to understand your current environment and identify a path forward.","primaryLabel":"Contact Us","primaryHref":"/contact"} /-->'
        echo "  ✅ Seeded Subpage: Infrastructure"
    fi
fi
fi
# ── Support ───────────────────────────────────────────────────
SUP_ID=$(wp post list --post_type=page --name=support --field=ID 2>/dev/null)
if [ -n "$SUP_ID" ]; then
    wp post update "$SUP_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Support","heading":"Access assistance for your systems and services.","subtitle":"Ongoing support maintains system reliability. Our structured processes enable efficient response and timely issue resolution.","backgroundImage":"'"${ASSETS}"'/hero-support.jpg","imageAlt":"Police officer on duty","align":"full"} /-->

<!-- wp:xfact/support-channels {"existingClientButtonHref":"https://portal.dataservtech.com/"} /-->'
    echo "  ✅ Seeded: Support"
fi

# ── Careers ───────────────────────────────────────────────────
CAR_ID=$(wp post list --post_type=page --name=careers --field=ID 2>/dev/null)
if [ -n "$CAR_ID" ]; then
    wp post update "$CAR_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Careers","heading":"Work behind the systems communities rely on.","subtitle":"Join a team that supports mission-critical technology for public-sector organizations. Build systems that must work every day.","backgroundImage":"'"${ASSETS}"'/hero-careers.jpg","imageAlt":"Volunteers working together","align":"full"} /-->

<!-- wp:xfact/feature-cards {"sectionLabel":"Why xFact","heading":"What it means to work here","cards":[{"title":"Mission-Driven Work","description":"Every project supports systems critical to public services — from public safety to education to healthcare.","iconName":"Target"},{"title":"High-Accountability Environments","description":"Our teams operate in environments where reliability matters. The work we do must function every day.","iconName":"ShieldCheck"},{"title":"Real Impact","description":"Employees contribute directly to systems that serve communities and support essential public operations.","iconName":"Zap"},{"title":"Growth \u0026 Development","description":"Work alongside experienced professionals across infrastructure, security, applications, and strategy.","iconName":"TrendingUp"}]} /-->

<!-- wp:xfact/code-embed {"code":"<link rel=\"stylesheet\" type=\"text/css\" href=\"//reports.hrmdirect.com/employment/default/sm/settings/dynamic-embed/dynamic-iframe-embed-css.php\" />\n<script type=\"text/javascript\" src=\"//reports.hrmdirect.com/employment/default/sm/settings/dynamic-embed/dynamic-iframe-embed-js.php\"></script>\n<script>\n  function resizeIframe(obj) {\n    obj.style.height = obj.contentWindow.document.body.scrollHeight + '\''px'\'';\n  }\n</script>\n<iframe id=\"hrmdirect\" src=\"//dataserv.hrmdirect.com/employment/job-openings.php?search=true&nohd=&dept=-1&city=-1&state=-1\" style=\"width: 100%; height: 400px;\" frameborder=\"0\" scrolling=\"auto\" allowtransparency=\"true\" title=\"Career Site\"></iframe>"} /-->

<!-- wp:xfact/cta-section {"variant":"light","align":"full","title":"Interested in joining the team?","subtitle":"We'\''re always looking for talented people who want to do meaningful work.","primaryLabel":"Get in Touch","primaryHref":"/contact"} /-->'
    echo "  ✅ Seeded: Careers"
fi

# ── Contact ───────────────────────────────────────────────────
CON_ID=$(wp post list --post_type=page --name=contact --field=ID 2>/dev/null)
if [ -n "$CON_ID" ]; then
    wp post update "$CON_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Contact","heading":"Start the Conversation","subtitle":"Complex environments require thoughtful evaluation.","backgroundImage":"'"${ASSETS}"'/hero-contact.jpg","imageAlt":"Kids using technology in the classroom","align":"full"} /-->

<!-- wp:xfact/contact-form {"heading":"Get in Touch","subtitle":"Tell us about your organization and what you'\''re looking to accomplish. We'\''ll connect you with the right team."} /-->

<!-- wp:xfact/text-section {"sectionLabel":"Technology Assessment","heading":"Evaluate Your Systems","body":"Our technology assessments help organizations understand their current environment, identify risks and opportunities, and develop a practical roadmap for improvement."} /-->'
    echo "  ✅ Seeded: Contact"
fi

# ── Privacy Policy ────────────────────────────────────────────
PRI_ID=$(wp post list --post_type=page --name=privacy --field=ID 2>/dev/null)
if [ -n "$PRI_ID" ]; then
    wp post update "$PRI_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Legal","heading":"Privacy Policy","subtitle":"Effective date: January 1, 2025","backgroundImage":"'"${ASSETS}"'/hero-contact.jpg","imageAlt":"Privacy and security","align":"full"} /-->

<!-- wp:xfact/section-list {"showNumbers":true,"introText":"xFact (\"we,\" \"us,\" or \"our\") is committed to protecting the privacy of individuals who visit our website and use our services. This Privacy Policy describes how we collect, use, and safeguard your information.","sections":[{"title":"Information We Collect","content":"We collect information you provide directly, such as your name, email address, organization, and message content when you submit a contact form or request an assessment. We also automatically collect certain technical information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages viewed."},{"title":"How We Use Your Information","content":"We use the information we collect to respond to your inquiries and requests, provide and improve our services, communicate with you about our offerings, comply with legal obligations, and protect the security and integrity of our website and services."},{"title":"Information Sharing","content":"We do not sell, rent, or trade your personal information to third parties. We may share information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential. We may also disclose information when required by law or to protect our rights."},{"title":"Data Security","content":"We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security."},{"title":"Cookies and Tracking","content":"Our website may use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookie settings through your browser preferences. Disabling cookies may limit certain functionality of our website."},{"title":"Third-Party Links","content":"Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit."},{"title":"Data Retention","content":"We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements."},{"title":"Your Rights","content":"You may request access to, correction of, or deletion of your personal information by contacting us. We will respond to your request within a reasonable timeframe and in accordance with applicable law."},{"title":"Changes to This Policy","content":"We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Your continued use of our website after any changes constitutes acceptance of the revised policy."},{"title":"Contact Us","content":"If you have questions about this Privacy Policy or our data practices, please contact us at info@xfact.com or through our contact page."}]} /-->'
    echo "  ✅ Seeded: Privacy"
fi

# ── Terms of Service ──────────────────────────────────────────
TER_ID=$(wp post list --post_type=page --name=terms --field=ID 2>/dev/null)
if [ -n "$TER_ID" ]; then
    wp post update "$TER_ID" --post_content='<!-- wp:xfact/page-hero {"sectionLabel":"Legal","heading":"Terms of Service","subtitle":"Effective date: January 1, 2025","backgroundImage":"'"${ASSETS}"'/hero-contact.jpg","imageAlt":"Terms and conditions","align":"full"} /-->

<!-- wp:xfact/section-list {"showNumbers":true,"introText":"Please read these Terms of Service carefully before using the xFact website. These terms govern your access to and use of our website and services.","sections":[{"title":"Acceptance of Terms","content":"By accessing or using the xFact website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."},{"title":"Use of Website","content":"You may use our website for lawful purposes only. You agree not to use the site in any way that could damage, disable, overburden, or impair the site or interfere with any other party'\''s use and enjoyment. You may not attempt to gain unauthorized access to any portion of the website, other accounts, computer systems, or networks connected to the website."},{"title":"Intellectual Property","content":"All content on this website, including text, graphics, logos, images, and software, is the property of xFact or its content suppliers and is protected by United States and international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent."},{"title":"Services Description","content":"xFact provides technology services for public-sector organizations, including infrastructure management, cybersecurity, application development, data services, and strategic consulting. Descriptions of services on this website are for informational purposes only and do not constitute a binding offer or contract. Specific service terms are governed by individual client agreements."},{"title":"Disclaimer of Warranties","content":"This website and its content are provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied. xFact does not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components. We make no warranties regarding the accuracy, reliability, or completeness of any content on this site."},{"title":"Limitation of Liability","content":"To the fullest extent permitted by applicable law, xFact shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of or inability to use the website, even if we have been advised of the possibility of such damages. Our total liability for any claim arising from your use of the website shall not exceed the amount you paid, if any, for accessing the site."},{"title":"Indemnification","content":"You agree to indemnify and hold harmless xFact, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys'\'' fees) arising out of or related to your use of the website or violation of these Terms of Service."},{"title":"Third-Party Links","content":"Our website may contain links to third-party websites or services that are not owned or controlled by xFact. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites. You acknowledge and agree that xFact shall not be responsible or liable for any damage or loss caused by or in connection with the use of any third-party content or services."},{"title":"Governing Law","content":"These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in our principal place of business."},{"title":"Changes to Terms","content":"We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this website. Your continued use of the website following any changes constitutes acceptance of the revised terms. We encourage you to review these terms periodically."},{"title":"Contact","content":"If you have any questions about these Terms of Service, please contact us at info@xfact.com or through our contact page."}]} /-->'
    echo "  ✅ Seeded: Terms"
fi


# ── Case Studies ──────────────────────────────────────────────
echo "📄 Creating Case Studies..."
for cs_info in \
    "Public Safety Data Broker Solution:public-safety-data-broker" \
    "License Management System:license-management-system" \
    "Cloud Migration Strategic Roadmap:cloud-migration-strategic-roadmap"; do
    cs_title="${cs_info%%:*}"
    cs_slug="${cs_info##*:}"
    if ! wp post list --post_type=page --name="$cs_slug" --field=ID 2>/dev/null | grep -q .; then
        wp post create --post_type=page --post_title="$cs_title" --post_name="$cs_slug" --post_status=publish
        echo "  ✅ Created case study: $cs_title ($cs_slug)"
    fi
done

CS1_ID=$(wp post list --post_type=page --name=public-safety-data-broker --field=ID 2>/dev/null)
if [ -n "$CS1_ID" ]; then
    wp post update "$CS1_ID" --post_content='<!-- wp:xfact/case-study-page {"source":"xFact","title":"Public Safety Data Broker Solution","summary":"A high-volume, fault-tolerant message broker enabling standardized criminal-justice information sharing across state, federal, and international systems.","client":"State-wide Criminal Justice Information Services Agency","challenge":["Facilitate a standardized way of sharing disparate criminal justice information across systems.","Interface with multiple state, federal, and international data sources while avoiding API explosion and ensuring data-driven transactions could be handled efficiently.","Provide high-volume message handling, guaranteed secure message delivery, and mission-critical system performance and reliability."],"services":["Collaboratively planned and designed/architected a component-based solution that emphasized scalability, fault tolerance, and security.","Rapidly implemented a high-volume, high-performance message broker with intelligent header-based message formatting and guaranteed delivery.","Incorporated comprehensive advanced security protocols to ensure message integrity and confidentiality, including end-to-end encryption and secure access controls.","Leveraged state-of-the-art technologies to ensure the system could scale to handle transaction bursts while maintaining a minimal memory footprint."],"outcomes":["Provided standards-based integration of multiple state, federal, and international data sources.","Successfully processing over 2.5 million transactions daily, with the capability to handle bursts of up to 5 million transactions, ensuring timely access to critical criminal justice information.","Guaranteed secure message delivery with a highly fault-tolerant architecture, significantly reducing the risk of data breaches and system downtime.","Streamlined operations, reducing complexity and enhancing efficiency for law enforcement agencies."],"narrative":"xFact’s Public Safety Data Broker Solution exemplifies cutting-edge technology application in public safety, demonstrating our firm’s commitment to developing solutions that meet the critical needs of law enforcement agencies. Through strategic planning, technical excellence, and a focus on security and scalability, we have delivered a system that not only meets but exceeds the expectations of our client, paving the way for safer communities through improved information sharing."} /-->'
fi

CS2_ID=$(wp post list --post_type=page --name=license-management-system --field=ID 2>/dev/null)
if [ -n "$CS2_ID" ]; then
    wp post update "$CS2_ID" --post_content='<!-- wp:xfact/case-study-page {"source":"xFact","title":"License Management System","summary":"A modular firearms-licensing platform rolled out across 350+ local police departments and all state-licensed firearms dealers — the first solution of its kind in the USA.","client":"State-wide Firearms Licensing Agency","challenge":["Plan, test, and implement a mission-critical roll-out to comply with legal requirements for firearms licensing.","Satisfy diverse end-user training requirements and change management needs to ensure successful transition from paper/manual processes to a fully electronic model.","Maintain and synchronize legacy system in parallel with phased roll-out of new platform."],"services":["Modularized License Management System platform.","Re-usable testing processes, protocols, and tools to ensure compliance with all business and legal requirements.","Data migration and synchronization with legacy system.","Comprehensive training programs and materials for various types of end-users, operational managers, and support personnel.","“Roadshow” style training and deployments to engage stakeholders and ensure implementation success."],"outcomes":["Successfully implemented all deployments and go-live phases across over 350 local police departments and all state-licensed firearms dealers.","Mitigated risks and expectations for service levels to ensure a smooth deployment and trust in the new system.","Recognized as an innovative government solution and the first solution of its kind deployed in the USA.","Successfully facilitated funding for additional enhancements and phases."]} /-->'
fi

CS3_ID=$(wp post list --post_type=page --name=cloud-migration-strategic-roadmap --field=ID 2>/dev/null)
if [ -n "$CS3_ID" ]; then
    wp post update "$CS3_ID" --post_content='<!-- wp:xfact/case-study-page {"source":"xFact","title":"Cloud Migration Strategic Roadmap","summary":"A comprehensive cloud migration roadmap and serverless architecture recommendations for a major criminal-justice agency, meeting FedRAMP High and CJIS compliance.","client":"Major Public Sector Criminal Justice Agency","challenge":["Delivering a comprehensive cloud migration approach and recommendations to support hybrid connectivity and a move towards a serverless architecture, balancing the need to maintain legacy systems with the advantages of cloud-based solutions.","Identifying recommendations around robust security measures, including multi-factor authentication and a comprehensive backup and recovery strategy, to protect sensitive criminal justice information.","Accurately evaluating the current infrastructure, including virtual machines, physical servers, and critical software components like ETL and SSIS packages, to understand the baseline and identify areas for improvement.","Ensuring government cloud compliance via a new system architecture complied with stringent government cloud standards, including FedRAMP High and CJIS Security Policy, while migrating to a cloud-based solution."],"services":["Established an enterprise architecture assessment through a review of the existing system infrastructure(s) and dependencies to identify opportunities for modernization and enhancement.","Utilized industry-leading frameworks to design a resilient, highly available cloud migration strategy and infrastructure that meets government compliance requirements, focusing on a serverless, low-maintenance architecture that simplifies ongoing operations.","Developed a networking and infrastructure plan that supports both cloud and hybrid environments, ensuring secure, efficient connectivity for all users.","Outlined government cloud-based identity management solutions and migration recommendations to support seamless integration and continued compliance with security standards."],"outcomes":["Provided comprehensive recommendations for a highly available, resilient, and reliable architecture by implementing best practices for designing a highly available cloud infrastructure.","Delivered a migration roadmap describing the requirements (business, technical, quality, security, etc.) for migrating the agency’s system(s) to the Cloud, including the recommended tools that shall be used in the migration.","Provided a final report and set of recommendations to senior leadership and executive sponsors research, evaluation, findings, risks assessment and recommendations for the proposed cloud solution."]} /-->'
fi

echo "✅ Page content seeding complete."

