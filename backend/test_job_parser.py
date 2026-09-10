import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from services.job_parser import JobParser

def run_regression_tests():
    print('Running JD Parser Regression Tests (7 Mandatory Cases)...\n')

    # Test 1 — Company
    t1 = JobParser.classify_item('Company: NovaAI Technologies')
    assert t1.category == 'metadata', f'Test 1 failed: {t1.category} != metadata'
    assert t1.scorable is False, f'Test 1 failed: scorable is {t1.scorable}'
    print('[PASS] Test 1: Company -> category=metadata, scorable=False')

    # Test 2 — Location
    t2 = JobParser.classify_item('Location: San Francisco, CA (Hybrid)')
    assert t2.category == 'metadata', f'Test 2 failed: {t2.category} != metadata'
    assert t2.scorable is False, f'Test 2 failed: scorable is {t2.scorable}'
    print('[PASS] Test 2: Location -> category=metadata, scorable=False')

    # Test 3 — Heading
    t3 = JobParser.classify_item('Responsibilities:')
    assert t3.category == 'section_heading', f'Test 3 failed: {t3.category} != section_heading'
    assert t3.scorable is False, f'Test 3 failed: scorable is {t3.scorable}'
    print('[PASS] Test 3: Heading -> category=section_heading, scorable=False')

    # Test 4 — Experience (numeric preservation)
    t4 = JobParser.classify_item('2+ years of practical experience developing NLP applications')
    assert t4.category == 'experience', f'Test 4 failed: {t4.category} != experience'
    assert t4.minimum_years == 2.0, f'Test 4 failed: minimum_years is {t4.minimum_years}'
    assert t4.scorable is True, f'Test 4 failed: scorable is {t4.scorable}'
    assert t4.text.startswith('2+ years'), f'Test 4 failed: number stripped: {t4.text}'
    print('[PASS] Test 4: Experience -> category=experience, minimum_years=2, scorable=True')

    # Test 5 — Skill
    t5 = JobParser.classify_item('Strong proficiency in Python, PyTorch, and Scikit-learn')
    assert t5.category == 'required_skill', f'Test 5 failed: {t5.category} != required_skill'
    assert t5.scorable is True, f'Test 5 failed: scorable is {t5.scorable}'
    print('[PASS] Test 5: Skill -> category=required_skill, scorable=True')

    # Test 6 — Context
    t6 = JobParser.classify_item('We are seeking a Machine Learning Engineer to join our Core Intelligence team.')
    assert t6.category == 'context', f'Test 6 failed: {t6.category} != context'
    assert t6.scorable is False, f'Test 6 failed: scorable is {t6.scorable}'
    print('[PASS] Test 6: Context -> category=context, scorable=False')

    # Test 7 — Real responsibility
    t7 = JobParser.classify_item('Architect, train, and benchmark NLP models for classification, information extraction, and semantic matching.', current_section='responsibilities')
    assert t7.category == 'responsibility', f'Test 7 failed: {t7.category} != responsibility'
    assert t7.scorable is True, f'Test 7 failed: scorable is {t7.scorable}'
    print('[PASS] Test 7: Responsibility -> category=responsibility, scorable=True')

    # Additional Experience formats test
    formats = [
        ('1+ years of practical experience developing NLP applications', 1.0),
        ('3+ years experience with Python', 3.0),
        ('1-3 years of experience in data analytics', 1.0),
        ('2 years of experience', 2.0),
        ('minimum 2 years of software engineering', 2.0),
        ('at least 2 years of building REST APIs', 2.0),
        ('2–4 years working with cloud infrastructure', 2.0),
    ]
    for text, expected_yrs in formats:
        item = JobParser.classify_item(text)
        assert item.scorable is True, f'Failed scorable for {text}'
        assert item.minimum_years == expected_yrs, f'Expected {expected_yrs} for {text}, got {item.minimum_years}'
    print('[PASS] Additional Experience formats tests passed!')

    print('\nALL 7 REGRESSION TESTS AND VARIANT FORMATS PASSED SUCCESSFULLY!')

if __name__ == '__main__':
    run_regression_tests()
