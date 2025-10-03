"""
Script to load individual race CSV data for detailed views
"""
import csv
import json
from pathlib import Path

def load_race_data(year: int) -> dict:
    """Load detailed race data for a specific year"""
    csv_path = Path(__file__).parent.parent / 'data' / f'utmb_{year}.csv'
    
    if not csv_path.exists():
        return None
    
    participants = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Clean the data
            participant = {
                'bib': row.get('bib', ''),
                'name': row.get('name', '').strip(),
                'team': row.get('team', '').strip(),
                'category': row.get('category', '').strip(),
                'rank': row.get('rank', ''),
                'nationality': row.get('nationality', '').strip(),
                'time': row.get('time', '').strip(),
                'timediff': row.get('timediff', '').strip(),
            }
            # Only add if we have essential data
            if participant['name'] and participant['rank']:
                participants.append(participant)
    
    return {
        'year': year,
        'participants': participants,
        'total': len(participants)
    }

def generate_all_race_details():
    """Generate JSON files for all years"""
    output_dir = Path(__file__).parent.parent / 'public' / 'data' / 'races'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    for year in range(2003, 2018):
        data = load_race_data(year)
        if data:
            output_path = output_dir / f'race_{year}.json'
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print(f"Generated {output_path}")

if __name__ == '__main__':
    generate_all_race_details()

