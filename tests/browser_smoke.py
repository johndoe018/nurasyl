"""Functional browser checks. Requires Python Playwright and Chromium (see README)."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE_URL = os.environ.get("AXIOM_TEST_URL", "http://127.0.0.1:3000")
ARTIFACTS = Path(os.environ.get("AXIOM_TEST_ARTIFACTS", "/tmp/axiom-browser-results"))
ARTIFACTS.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium"),
        headless=True,
        args=["--no-sandbox"],
    )
    page = browser.new_page(viewport={"width": 1440, "height": 1100})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(BASE_URL, wait_until="networkidle")
    expect(page).to_have_title("Axiom — Find your angle")
    assert not page.evaluate("document.documentElement.scrollWidth > innerWidth")
    page.get_by_role("button", name="Bookmark this problem", exact=True).click()
    page.get_by_label("Length of the hypotenuse").fill("5")
    page.get_by_role("button", name="Check answer").click()
    expect(page.locator("#answer-feedback")).to_contain_text("Try again")
    page.get_by_role("button", name="A little hint?").click()
    page.get_by_role("button", name="Another hint").click()
    page.get_by_role("button", name="Another hint").click()
    expect(page.locator(".hint-row")).to_have_count(3)
    page.get_by_role("button", name="See the worked solution").click()
    expect(page.locator(".solution-step")).to_have_count(3)
    page.get_by_label("Length of the hypotenuse").fill("10")
    page.get_by_role("button", name="Check answer").click()
    expect(page.locator("#answer-feedback")).to_contain_text("Try a new variation")
    expect(page.locator(".progress-text")).to_contain_text("0 of 3")
    page.get_by_role("button", name="New variation").click()
    expect(page.locator(".hint-row")).to_have_count(0)
    expect(page.locator(".solution-step")).to_have_count(0)
    page.get_by_label("Length of the hypotenuse").fill("13")
    page.get_by_label("Length of the hypotenuse").press("Enter")
    expect(page.locator("#answer-feedback")).to_contain_text("Exactly right")
    page.locator(".level-picker").get_by_role("button", name="Standard").click()
    expect(page.get_by_label("Height reached by the ladder")).to_have_value("")
    page.get_by_label("Height reached by the ladder").fill("12")
    page.get_by_role("button", name="Check answer").click()
    expect(page.locator("#answer-feedback")).to_contain_text("Exactly right")
    page.locator(".level-picker").get_by_role("button", name="Advanced").click()
    page.get_by_label("Shortest distance along the surface").fill("13,89")
    page.get_by_role("button", name="Check answer").click()
    expect(page.locator("#answer-feedback")).to_contain_text("Exactly right")
    expect(page.locator(".progress-text")).to_contain_text("3 of 3")
    page.locator(".main-nav").get_by_role("button", name="My progress").click()
    expect(page.locator(".stat-grid>div").nth(0)).to_contain_text("3")
    expect(page.locator(".history-list>div")).to_have_count(5)
    page.reload(wait_until="networkidle")
    expect(page.locator(".progress-text")).to_contain_text("3 of 3")
    page.locator(".main-nav").get_by_role("button", name="Bookmarks").click()
    expect(page.locator(".bookmark-list article")).to_have_count(1)
    page.get_by_role("button", name="Continue learning").click()
    expect(page.locator(".problem-title")).to_have_text("Meet the missing side.")

    # Explicitly simulate an unavailable model; this does NOT validate model inference.
    page.route("https://huggingface.co/**", lambda route: route.abort())
    page.get_by_role("button", name="Ask AI tutor").click()
    page.get_by_role("button", name="Explain my next step").click()
    expect(page.get_by_role("alert")).to_contain_text("couldn’t connect", timeout=30000)
    expect(page.locator(".verified-hint")).to_contain_text("hypotenuse")
    page.screenshot(path=str(ARTIFACTS / "ai-unavailable.png"))
    page.keyboard.press("Escape")
    expect(page.get_by_role("dialog")).to_have_count(0)

    search = page.get_by_label("Search topics")
    search.fill("calculus")
    expect(page.locator(".search-results")).to_contain_text("No topics found")
    search.fill("geometry")
    search.press("Enter")
    expect(page.locator(".search-results")).to_have_count(0)
    page.get_by_role("button", name="Switch to light mode").click()
    assert page.locator("html").get_attribute("data-theme") == "light"
    page.reload(wait_until="networkidle")
    assert page.locator("html").get_attribute("data-theme") == "light"
    page.get_by_role("button", name="Switch to dark mode").click()

    page.set_viewport_size({"width": 390, "height": 844})
    page.evaluate("window.scrollTo(0,0)")
    assert not page.evaluate("document.documentElement.scrollWidth > innerWidth")
    page.locator(".mobile-nav").get_by_role("button", name="My progress").click()
    expect(page.get_by_role("heading", name="My progress", exact=True)).to_be_visible()
    page.locator(".mobile-nav").get_by_role("button", name="Bookmarks").click()
    page.get_by_role("button", name="Remove saved problem").click()
    expect(page.get_by_role("heading", name="Keep a little inspiration.")).to_be_visible()
    page.locator(".mobile-nav").get_by_role("button", name="How it works").click()
    expect(page.get_by_role("dialog")).to_be_visible()
    page.keyboard.press("Escape")
    page.locator(".mobile-nav").get_by_role("button", name="Home").click()
    page.screenshot(path=str(ARTIFACTS / "mobile.png"), full_page=True)
    assert not errors, errors
    print("PASS: grading, revealed-solution policy, 3 levels, 3 hints, worked solutions, variations, progress persistence, bookmarks, model-error handling, search, theme persistence, modal keyboard dismissal, mobile navigation, no overflow, no uncaught browser errors.")
    browser.close()
