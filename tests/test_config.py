from api.config import advisory_for_risk, risk_for_value


def test_risk_bands() -> None:
    assert risk_for_value(16.99, 19.05) == "GREEN"
    assert risk_for_value(17.05, 19.05) == "YELLOW"
    assert risk_for_value(19.05, 19.05) == "RED"


def test_advisory_library_has_actions() -> None:
    red = advisory_for_risk("RED")
    assert red["headline"]
    assert len(red["actions"]) >= 3
