// ============================================================
// BONNIEBYTE PC - AIRFLOW CALCULATOR LOGIC
// (airflow.js)
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
    const root = document.querySelector(".section-airflow");
    if (!root) return; // not on this page

    // Elements
    const modeButtons = root.querySelectorAll(".airflow-mode-btn");
    const panels = root.querySelectorAll(".airflow-panel");
    const recalcBtn = root.querySelector("#af-recalculate");

    // Beginner inputs
    const casePresetEl = root.querySelector("#af-case-preset");
    const fanPresetEl = root.querySelector("#af-fan-preset");
    const intakeCountEl = root.querySelector("#af-intake-count");
    const exhaustCountEl = root.querySelector("#af-exhaust-count");
    const radPosEl = root.querySelector("#af-rad-position");
    const roomTempEl = root.querySelector("#af-room-temp");

    // Advanced inputs
    const advCfmEl = root.querySelector("#af-advanced-cfm");
    const advStaticEl = root.querySelector("#af-static-pressure");
    const filterRestrictEl = root.querySelector("#af-filter-restriction");
    const caseRestrictEl = root.querySelector("#af-case-restriction");
    const advIntakeEl = root.querySelector("#af-adv-intake");
    const advExhaustEl = root.querySelector("#af-adv-exhaust");

    // Summary outputs
    const intakeOut = root.querySelector("#af-intake-cfm");
    const exhaustOut = root.querySelector("#af-exhaust-cfm");
    const pressureLabelOut = root.querySelector("#af-pressure-label");
    const suggestionOut = root.querySelector("#af-suggestion-text");

    // Visual elements
    const caseEl = root.querySelector(".af-case");
    const flowIntakeEl = root.querySelector(".af-flow-intake");
    const flowExhaustEl = root.querySelector(".af-flow-exhaust");
    const pressurePill = root.querySelector("#af-pressure-pill");
    const fansIntakeStack = root.querySelector(".af-fans-intake");
    const fansExhaustStack = root.querySelector(".af-fans-exhaust");
    const fansTopStack = root.querySelector(".af-fans-top");
    const fansBottomStack = root.querySelector(".af-fans-bottom");

    // Fan presets (approximate)
    const FAN_PRESETS = {
        "bb-nw120": { cfm: 60, staticPressure: 1.8, label: "BonnieByte Northern Wind 120 ARGB (est.)" },
        "noctua-nf12": { cfm: 55, staticPressure: 2.6, label: "Noctua NF-F12" },
        "p12": { cfm: 56, staticPressure: 2.2, label: "Arctic P12" },
        "generic-50": { cfm: 50, staticPressure: 1.5, label: "Generic 120mm (50 CFM)" },
        "custom": null
    };

    // Case presets (affect suggestion + restriction)
    const CASE_PRESETS = {
        "generic": { restriction: "balanced", suggestedIntake: 2, suggestedExhaust: 1 },
        "nzxt-h510": { restriction: "tight", suggestedIntake: 2, suggestedExhaust: 2 },
        "lancool-215": { restriction: "open", suggestedIntake: 2, suggestedExhaust: 1 },
        "meshify-c": { restriction: "balanced", suggestedIntake: 2, suggestedExhaust: 1 },
        "bb-custom": { restriction: "balanced", suggestedIntake: 3, suggestedExhaust: 2 }
    };

    // Restriction factors
    const FILTER_FACTORS = {
        "low": 0.95,
        "medium": 0.85,
        "high": 0.7
    };

    const CASE_FACTORS = {
        "open": 1.0,
        "balanced": 0.9,
        "tight": 0.8
    };

    const RAD_FACTORS = {
        "none": 1.0,
        "front-240": 0.75,
        "front-360": 0.7,
        "top-240": 0.8,
        "top-360": 0.75
    };

    // Mode switching
    modeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const mode = btn.dataset.mode;
            modeButtons.forEach(b => {
                b.classList.toggle("active", b === btn);
                b.setAttribute("aria-selected", b === btn ? "true" : "false");
            });
            panels.forEach(p => {
                p.classList.toggle("active", p.dataset.panel === mode);
            });
            // Sync beginner inputs to advanced or vice versa
            syncBetweenModes(mode);
            recalc();
        });
    });

    function syncBetweenModes(modeJustActivated) {
        if (modeJustActivated === "advanced") {
            // When switching to advanced, take numbers from beginner
            advIntakeEl.value = intakeCountEl.value;
            advExhaustEl.value = exhaustCountEl.value;
            const fanPresetKey = fanPresetEl.value;
            const preset = FAN_PRESETS[fanPresetKey];
            if (preset) {
                advCfmEl.value = preset.cfm;
                advStaticEl.value = preset.staticPressure;
            }
        } else {
            // Switching back to beginner -> keep counts aligned
            intakeCountEl.value = advIntakeEl.value;
            exhaustCountEl.value = advExhaustEl.value;
        }
    }

    // Create fan icons based on counts
    function renderFans(intakeCount, exhaustCount) {
        const makeFan = (type) => {
            const fan = document.createElement("div");
            fan.className = "af-fan " + (type === "intake" ? "af-intake" : "af-exhaust");
            return fan;
        };

        fansIntakeStack.innerHTML = "";
        fansExhaustStack.innerHTML = "";
        fansTopStack.innerHTML = "";
        fansBottomStack.innerHTML = "";

        for (let i = 0; i < intakeCount; i++) {
            fansIntakeStack.appendChild(makeFan("intake"));
        }

        for (let i = 0; i < exhaustCount; i++) {
            fansExhaustStack.appendChild(makeFan("exhaust"));
        }

        // Simple logic: if radiator on top, add some fans to top zone
        const radKey = radPosEl.value;
        if (radKey.startsWith("top")) {
            fansTopStack.appendChild(makeFan("exhaust"));
        }
        if (radKey.startsWith("front")) {
            // Already visually covered by front, so we can optionally show more
            if (intakeCount === 0) {
                fansIntakeStack.appendChild(makeFan("intake"));
            }
        }
    }

    // Main calculation
    function recalc() {
        // Determine active mode
        const activeMode = root.querySelector(".airflow-mode-btn.active")?.dataset.mode || "beginner";

        let intakeFans = 0;
        let exhaustFans = 0;
        let cfmPerFan = 60;
        let filterLevel = "medium";
        let caseLevel = "balanced";
        let radKey = radPosEl.value;

        if (activeMode === "beginner") {
            intakeFans = clampInt(intakeCountEl.value, 0, 9);
            exhaustFans = clampInt(exhaustCountEl.value, 0, 9);

            const fanPresetKey = fanPresetEl.value;
            const caseKey = casePresetEl.value;
            const preset = FAN_PRESETS[fanPresetKey];
            const casePreset = CASE_PRESETS[caseKey];

            if (preset) {
                cfmPerFan = preset.cfm;
            }

            if (casePreset) {
                caseLevel = casePreset.restriction;
            }

            // Assume medium filter by default, can infer some from case
            if (caseLevel === "open") filterLevel = "low";
            else if (caseLevel === "tight") filterLevel = "high";
            else filterLevel = "medium";
        } else {
            intakeFans = clampInt(advIntakeEl.value, 0, 9);
            exhaustFans = clampInt(advExhaustEl.value, 0, 9);
            cfmPerFan = clampFloat(advCfmEl.value, 10, 120);
            filterLevel = filterRestrictEl.value;
            caseLevel = caseRestrictEl.value;
        }

        const filterFactor = FILTER_FACTORS[filterLevel] || 0.85;
        const caseFactor = CASE_FACTORS[caseLevel] || 0.9;
        const radFactor = RAD_FACTORS[radKey] || 1.0;

        // Intake fans might be affected by radiator more if it's front-mounted
        let intakeRestrictionExtra = 1.0;
        if (radKey === "front-240" || radKey === "front-360") {
            intakeRestrictionExtra = radFactor;
        }

        // Very rough estimate of effective airflow
        const baseIntakeCFM = intakeFans * cfmPerFan;
        const baseExhaustCFM = exhaustFans * cfmPerFan;

        const effIntake = baseIntakeCFM * filterFactor * caseFactor * intakeRestrictionExtra;
        const effExhaust = baseExhaustCFM * caseFactor * 0.98; // tiny loss for rear/top vents

        // Pressure difference and ratio
        const diff = effIntake - effExhaust;
        const total = Math.max(effIntake, effExhaust, 1);
        const ratio = diff / total;

        // Update summary values
        intakeOut.textContent = effIntake > 0 ? effIntake.toFixed(1) : "0.0";
        exhaustOut.textContent = effExhaust > 0 ? effExhaust.toFixed(1) : "0.0";

        // Determine pressure label
        let pressureLabel = "Neutral";
        let caseClass = "af-pressure-neutral";
        let suggestion = "This looks like a balanced configuration. Always verify temps in your own build.";

        if (ratio > 0.25) {
            pressureLabel = "Strong Positive";
            caseClass = "af-pressure-positive";
            suggestion = "You have strong positive pressure. This helps keep dust out, but ensure hot air can escape.";
        } else if (ratio > 0.08) {
            pressureLabel = "Slight Positive";
            caseClass = "af-pressure-positive";
            suggestion = "Slight positive pressure is often ideal: good dust control with decent exhaust.";
        } else if (ratio < -0.25) {
            pressureLabel = "Strong Negative";
            caseClass = "af-pressure-negative";
            suggestion = "Strong negative pressure can improve GPU/CPU temps, but may pull dust through every gap.";
        } else if (ratio < -0.08) {
            pressureLabel = "Slight Negative";
            caseClass = "af-pressure-negative";
            suggestion = "Slight negative pressure can help clear hot air quickly, but watch for extra dust.";
        }

        pressureLabelOut.textContent = pressureLabel;
        pressurePill.textContent = pressureLabel;
        suggestionOut.textContent = suggestion;

        // Update case visual class
        caseEl.classList.remove("af-pressure-positive", "af-pressure-neutral", "af-pressure-negative");
        caseEl.classList.add(caseClass);

        // Update flow visibility based on totals
        const intakeOpacity = effIntake > 0 ? 0.9 : 0.0;
        const exhaustOpacity = effExhaust > 0 ? 0.9 : 0.0;
        flowIntakeEl.style.opacity = intakeOpacity;
        flowExhaustEl.style.opacity = exhaustOpacity;

        // Render fan icons
        renderFans(intakeFans, exhaustFans);
    }

    function clampInt(val, min, max) {
        const n = parseInt(val, 10);
        if (isNaN(n)) return min;
        return Math.min(max, Math.max(min, n));
    }

    function clampFloat(val, min, max) {
        const n = parseFloat(val);
        if (isNaN(n)) return min;
        return Math.min(max, Math.max(min, n));
    }

    // Auto-recalculate on input changes
    const allInputs = root.querySelectorAll("input, select");
    allInputs.forEach(el => {
        el.addEventListener("change", recalc);
        el.addEventListener("input", function () {
            // For number fields, recalc more responsively
            if (el.type === "number") recalc();
        });
    });

    recalcBtn.addEventListener("click", function (e) {
        e.preventDefault();
        recalc();
    });

    // Initial render
    syncBetweenModes("beginner");
    recalc();
});
