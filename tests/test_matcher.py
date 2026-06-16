from src.eligibility.rules import check_eligibility

def test_check_eligibility(monkeypatch):
    # Mock get_raw_scheme
    def mock_get_raw_scheme(scheme_id):
        return {
            "scheme_id": "test-1",
            "eligibility_rules": {
                "has_land": True,
                "is_disabled": False
            }
        }
    
    monkeypatch.setattr("src.eligibility.rules.get_raw_scheme", mock_get_raw_scheme)
    
    # Should pass
    assert check_eligibility("test-1", {"has_land": True, "is_disabled": False}) == True
    
    # Should fail because they don't have land
    assert check_eligibility("test-1", {"has_land": False, "is_disabled": False}) == False
