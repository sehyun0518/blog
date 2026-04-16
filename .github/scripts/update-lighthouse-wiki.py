"""
Reads Lighthouse scores from environment variables, then writes/updates
Lighthouse-Reports.md in the cloned wiki directory (wiki-repo/).
"""
import os
import json
import re
from datetime import datetime, timezone


def emoji(score: str) -> str:
    s = int(score)
    return "🟢" if s >= 90 else "🟡" if s >= 50 else "🔴"


def main() -> None:
    perf = os.environ["PERF"]
    a11y = os.environ["A11Y"]
    bp = os.environ["BP"]
    seo = os.environ["SEO"]
    full_sha = os.environ["COMMIT_SHA"]
    sha = full_sha[:7]
    repo = os.environ["REPO"]

    links_raw = os.environ.get("LHCI_LINKS", "{}")
    try:
        links = json.loads(links_raw)
        report_url = next(iter(links.values()), "")
    except Exception:
        report_url = ""

    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    commit_url = f"https://github.com/{repo}/commit/{full_sha}"

    wiki_path = "wiki-repo/Lighthouse-Reports.md"
    old_rows: list[str] = []
    if os.path.exists(wiki_path):
        with open(wiki_path) as f:
            for line in f:
                if re.match(r"^\| \d{4}-\d{2}-\d{2}", line):
                    old_rows.append(line.rstrip())
    old_rows = old_rows[:19]  # keep max 19 previous rows (20 total with new)

    new_row = (
        f"| {date_str} | [`{sha}`]({commit_url}) "
        f"| {emoji(perf)} {perf} "
        f"| {emoji(a11y)} {a11y} "
        f"| {emoji(bp)} {bp} "
        f"| {emoji(seo)} {seo} |"
    )

    report_line = (
        f"\n- **Full report:** [View on LHCI public storage]({report_url})"
        if report_url
        else ""
    )

    lines = [
        "# Lighthouse Reports",
        "",
        "Automatically updated on every push to `main`.",
        "",
        "## Latest",
        "",
        "| Category | Score |",
        "|---|---|",
        f"| Performance | {emoji(perf)} {perf} |",
        f"| Accessibility | {emoji(a11y)} {a11y} |",
        f"| Best Practices | {emoji(bp)} {bp} |",
        f"| SEO | {emoji(seo)} {seo} |",
        "",
        f"- **Commit:** [`{sha}`]({commit_url})",
        f"- **Date:** {date_str}",
    ]
    if report_url:
        lines.append(f"- **Full report:** [View on LHCI public storage]({report_url})")
    lines += [
        "",
        "## History",
        "",
        "| Date | Commit | Performance | Accessibility | Best Practices | SEO |",
        "|---|---|---|---|---|---|",
        new_row,
        *old_rows,
        "",
    ]

    with open(wiki_path, "w") as f:
        f.write("\n".join(lines))

    print(f"Wiki updated: Perf={perf} A11Y={a11y} BP={bp} SEO={seo}")


if __name__ == "__main__":
    main()
