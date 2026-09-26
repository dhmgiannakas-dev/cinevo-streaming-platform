import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext/SettingsContext";
import Switch from "@mui/material/Switch";
import "./Settings.css";

function Settings() {

    const {
        autoplayTrailers,
        setAutoplayTrailers,
        reducedMotion,
        setReducedMotion,
        showMatureContent,
        setShowMatureContent,
    } = useContext(SettingsContext);


    return (
        <main className="settings-page">
            <div className="settings-container">

                {/* =========================
          HEADER
      ========================= */}

                <header className="settings-header">
                    <p className="settings-label">PREFERENCES</p>

                    <h1>Settings</h1>

                    <p className="settings-subtitle">
                        Customize your CINEVO experience.
                    </p>
                </header>


                {/* =========================
          PLAYBACK
      ========================= */}

                <section className="settings-section">
                    <div className="settings-section-header">
                        <h2>Playback</h2>

                        <p>Control how content behaves while browsing CINEVO.</p>
                    </div>


                    <div className="settings-card">

                        <div className="settings-option">
                            <div className="settings-option-info">
                                <h3>Autoplay Trailers</h3>

                                <p>
                                    Automatically play trailers when available.
                                </p>
                            </div>

                            <Switch
                                checked={autoplayTrailers}
                                onChange={() =>
                                    setAutoplayTrailers((prev) => !prev)
                                }
                                className="settings-switch"
                                inputProps={{
                                    "aria-label": "Autoplay trailers",
                                }}
                            />
                        </div>

                    </div>
                </section>


                {/* =========================
          ACCESSIBILITY
      ========================= */}

                <section className="settings-section">
                    <div className="settings-section-header">
                        <h2>Accessibility</h2>

                        <p>Adjust the interface to match your preferences.</p>
                    </div>


                    <div className="settings-card">

                        <div className="settings-option">
                            <div className="settings-option-info">
                                <h3>Reduced Motion</h3>

                                <p>
                                    Reduce animations and motion effects throughout CINEVO.
                                </p>
                            </div>

                            <Switch
                                checked={reducedMotion}
                                onChange={() =>
                                    setReducedMotion((prev) => !prev)
                                }
                                className="settings-switch"
                                inputProps={{
                                    "aria-label": "Reduced motion",
                                }}
                            />
                        </div>

                    </div>
                </section>


                {/* =========================
          CONTENT
      ========================= */}

                <section className="settings-section">
                    <div className="settings-section-header">
                        <h2>Content Preferences</h2>

                        <p>Choose what kind of content can appear while browsing.</p>
                    </div>


                    <div className="settings-card">

                        <div className="settings-option">
                            <div className="settings-option-info">
                                <h3>Include Adult Content</h3>

                                <p>
                                    Allow mature content to appear in discovery results.
                                </p>
                            </div>

                            <Switch
                                checked={showMatureContent}
                                onChange={() =>
                                    setShowMatureContent((prev) => !prev)
                                }
                                className="settings-switch"
                                inputProps={{
                                    "aria-label": "Show mature content",
                                }}
                            />
                        </div>

                    </div>
                </section>

            </div>
        </main>
    );
}


export default Settings;