#!/usr/bin/env python3
"""
Process UTMB CSV data (2003-2017) into TypeScript format.
Extracts race statistics, participant data, and checkpoint analysis.
"""
from __future__ import annotations
import polars as pl
from pathlib import Path
import json
from typing import Dict, List, Any, Optional
from datetime import datetime

DATA_DIR = Path("data")
OUTPUT_FILE = Path("src/data/processedData.ts")

def time_to_minutes(time_str: str) -> Optional[float]:
    """Convert HH:MM:SS to minutes."""
    if not time_str or time_str.strip() == "":
        return None
    try:
        parts = time_str.strip().split(":")
        if len(parts) == 3:
            h, m, s = map(int, parts)
            return h * 60 + m + s / 60
        return None
    except:
        return None

def parse_csv(file_path: Path, year: int) -> Dict[str, Any]:
    """Parse a single CSV file and extract statistics."""
    try:
        df = pl.read_csv(
            file_path,
            ignore_errors=True,
            null_values=["", " ", "NA", "N/A"],
        )
        
        # Basic stats
        total_participants = len(df)
        
        # Count finishers (those with a valid finish time)
        has_time = df.filter(pl.col("time").is_not_null())
        finishers = len(has_time)
        dnf_count = total_participants - finishers
        dnf_rate = (dnf_count / total_participants * 100) if total_participants > 0 else 0
        
        # Calculate average finish time
        finish_times = []
        for time_val in has_time["time"].to_list():
            if time_val:
                minutes = time_to_minutes(str(time_val))
                if minutes:
                    finish_times.append(minutes)
        
        avg_time_minutes = sum(finish_times) / len(finish_times) if finish_times else 0
        
        # Category distribution
        if "category" in df.columns:
            cat_counts = df["category"].value_counts()
            categories = dict(zip(cat_counts["category"].to_list(), cat_counts["count"].to_list()))
        else:
            categories = {}
        
        # Nationality distribution
        if "nationality" in df.columns:
            nat_counts = df["nationality"].value_counts().head(10)
            nationalities = dict(zip(nat_counts["nationality"].to_list(), nat_counts["count"].to_list()))
        else:
            nationalities = {}
        
        return {
            "year": year,
            "total_participants": total_participants,
            "finishers": finishers,
            "dnf_count": dnf_count,
            "dnf_rate": round(dnf_rate, 2),
            "avg_time_minutes": round(avg_time_minutes, 1),
            "categories": {str(k): v for k, v in categories.items()} if categories else {},
            "top_nationalities": {str(k): v for k, v in nationalities.items()} if nationalities else {},
        }
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def generate_typescript_file(data: List[Dict[str, Any]]) -> str:
    """Generate TypeScript file with processed data."""
    
    # Create interfaces
    ts_content = '''// Auto-generated from CSV data
// Last updated: ''' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + '''

export interface YearStats {
  year: number;
  total_participants: number;
  finishers: number;
  dnf_count: number;
  dnf_rate: number;
  avg_time_minutes: number;
  categories: Record<string, number>;
  top_nationalities: Record<string, number>;
}

export const raceData: YearStats[] = '''
    
    # Add the JSON data
    ts_content += json.dumps(data, indent=2)
    ts_content += ";\n\n"
    
    # Add helper functions
    ts_content += '''
// Helper: Get total participants across all years
export const getTotalParticipants = (): number => {
  return raceData.reduce((sum, year) => sum + year.total_participants, 0);
};

// Helper: Get overall DNF rate
export const getOverallDNFRate = (): number => {
  const totalParticipants = raceData.reduce((sum, y) => sum + y.total_participants, 0);
  const totalDNF = raceData.reduce((sum, y) => sum + y.dnf_count, 0);
  return totalParticipants > 0 ? (totalDNF / totalParticipants) * 100 : 0;
};

// Helper: Get all unique categories
export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  raceData.forEach(year => {
    Object.keys(year.categories).forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
};

// Helper: Get top nationalities across all years
export const getTopNationalities = (limit: number = 10): Record<string, number> => {
  const combined: Record<string, number> = {};
  raceData.forEach(year => {
    Object.entries(year.top_nationalities).forEach(([nat, count]) => {
      combined[nat] = (combined[nat] || 0) + count;
    });
  });
  return Object.fromEntries(
    Object.entries(combined)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
  );
};
'''
    
    return ts_content

def main():
    """Main processing pipeline."""
    print("UTMB Data Processor")
    print("=" * 50)
    
    # Find all CSV files
    csv_files = sorted(DATA_DIR.glob("utmb_*.csv"))
    print(f"Found {len(csv_files)} CSV files\n")
    
    all_data = []
    
    for csv_file in csv_files:
        # Extract year from filename (utmb_2003.csv -> 2003)
        year = int(csv_file.stem.split("_")[1])
        print(f"Processing {year}... ", end="")
        
        stats = parse_csv(csv_file, year)
        if stats:
            all_data.append(stats)
            print(f"OK: {stats['total_participants']} participants, {stats['finishers']} finishers")
        else:
            print("FAILED")
    
    # Sort by year
    all_data.sort(key=lambda x: x["year"])
    
    # Generate TypeScript file
    print(f"\nGenerating TypeScript file...")
    ts_content = generate_typescript_file(all_data)
    
    # Write to file
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(ts_content, encoding="utf-8")
    
    print(f"Wrote {len(ts_content)} chars to {OUTPUT_FILE}")
    print("\nSummary:")
    print(f"   Years: {len(all_data)}")
    print(f"   Total participants: {sum(d['total_participants'] for d in all_data):,}")
    print(f"   Total finishers: {sum(d['finishers'] for d in all_data):,}")
    print(f"   Overall DNF rate: {sum(d['dnf_count'] for d in all_data) / sum(d['total_participants'] for d in all_data) * 100:.1f}%")
    print("\nDone!")

if __name__ == "__main__":
    main()

