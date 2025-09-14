#!/usr/bin/env python3
import csv
import re
import pdfplumber
import os
from pathlib import Path

def extract_polling_data_from_pdf(pdf_path, output_path):
    """
    Extract polling station data from PDF and save to CSV
    """
    print(f"🚀 Starting PDF to CSV conversion...")
    print(f"📄 Reading PDF from: {pdf_path}")
    
    # Create output directory if it doesn't exist
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    
    polling_stations = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"📄 PDF pages: {len(pdf.pages)}")
            
            # Process each page
            for page_num, page in enumerate(pdf.pages):
                if (page_num + 1) % 50 == 0 or (page_num + 1) == len(pdf.pages):
                    print(f"📊 Processing page {page_num + 1}/{len(pdf.pages)}...")
                
                # Try table extraction first (more reliable for tabular data)
                tables = page.extract_tables()
                if tables:
                    page_stations = extract_from_tables(tables, page_num + 1)
                    if page_stations:
                        polling_stations.extend(page_stations)
                        continue
                
                # Fall back to text extraction
                text = page.extract_text()
                if not text:
                    continue
                
                # Extract polling station data from this page
                page_stations = extract_polling_data_from_text(text, page_num + 1)
                polling_stations.extend(page_stations)
        
        print(f"✅ Extracted {len(polling_stations)} polling stations from {len(pdf.pages)} pages")
        
        # Write to CSV
        write_to_csv(polling_stations, output_path)
        
        # Generate summary report
        generate_summary_report(polling_stations, output_path, len(pdf.pages))
        
        print(f"💾 CSV file saved to: {output_path}")
        print("🎉 PDF to CSV conversion completed successfully!")
        
        return polling_stations
        
    except Exception as e:
        print(f"❌ Error processing PDF: {e}")
        raise

def extract_from_tables(tables, page_num):
    """
    Extract data from PDF tables
    """
    polling_stations = []
    
    for table in tables:
        for row in table:
            # Skip header rows and empty rows
            if not row or len(row) < 10 or any(col in str(row).upper() for col in ['COUNTY', 'REGISTERED', 'PAGE']):
                continue
            
            try:
                # Clean the row data
                cleaned_row = [str(cell).strip() if cell else '' for cell in row]
                
                # Check if this looks like a data row (should have numeric values in certain positions)
                if (len(cleaned_row) >= 11 and 
                    cleaned_row[0].isdigit() and  # county code
                    cleaned_row[2].isdigit() and  # const code
                    cleaned_row[4].isdigit() and  # caw code
                    cleaned_row[6].isdigit() and  # reg centre code
                    cleaned_row[8].isdigit() and  # polling station code
                    cleaned_row[10].isdigit()):   # registered voters
                    
                    county_code, county_name, const_code, const_name, caw_code, caw_name, reg_centre_code, reg_centre_name, polling_station_code, polling_station_name, registered_voters = cleaned_row[:11]
                    
                    polling_stations.append({
                        'county_code': county_code,
                        'county_name': county_name,
                        'const_code': const_code,
                        'const_name': const_name,
                        'caw_code': caw_code,
                        'caw_name': caw_name,
                        'reg_centre_code': reg_centre_code,
                        'reg_centre_name': reg_centre_name,
                        'polling_station_code': polling_station_code,
                        'polling_station_name': polling_station_name,
                        'registered_voters': int(registered_voters)
                    })
                    
            except Exception as e:
                continue
    
    return polling_stations

def extract_polling_data_from_text(text_content, page_num):
    """
    Extract polling station data from text content
    """
    polling_stations = []
    
    # Split text into lines
    lines = text_content.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Skip header lines and page numbers
        if (not line or 
            'County Code' in line or 
            'REGISTERED VOTERS' in line or 
            line.startswith('Page ') or
            '=====' in line):
            continue
        
        # Try to parse the line
        station = parse_data_line(line)
        if station:
            polling_stations.append(station)
    
    return polling_stations

def parse_data_line(line):
    """
    Parse a single data line with multiple parsing strategies
    """
    # Strategy 1: Split by multiple spaces (tabular format)
    parts = re.split(r'\s{2,}', line)
    parts = [p.strip() for p in parts if p.strip()]
    
    if len(parts) >= 11:
        try:
            return create_station_from_parts(parts[:11])
        except:
            pass
    
    # Strategy 2: Look for specific pattern with regex
    pattern = r'^(\d{3})\s+([A-Z]+)\s+(\d{3})\s+([A-Z\s]+?)\s+(\d{4})\s+([A-Z\s]+?)\s+(\d+)\s+([A-Z\s]+?)\s+(\d+)\s+([A-Z\s]+?)\s+(\d+)$'
    match = re.match(pattern, line)
    if match:
        try:
            return create_station_from_parts(match.groups())
        except:
            pass
    
    # Strategy 3: More flexible regex pattern
    pattern2 = r'(\d{3})\s+([A-Z\s]+?)\s+(\d{3})\s+([A-Z\s]+?)\s+(\d{4})\s+([A-Z\s]+?)\s+(\d+)\s+([A-Z\s]+?)\s+(\d+)\s+([A-Z\s]+?)\s+(\d+)'
    match2 = re.search(pattern2, line)
    if match2:
        try:
            return create_station_from_parts(match2.groups())
        except:
            pass
    
    return None

def create_station_from_parts(parts):
    """
    Create a station dictionary from parts
    """
    county_code, county_name, const_code, const_name, caw_code, caw_name, reg_centre_code, reg_centre_name, polling_station_code, polling_station_name, registered_voters = parts
    
    # Clean names
    polling_station_name = polling_station_name.replace('Name Name', '').replace('Name', '').strip()
    
    return {
        'county_code': county_code,
        'county_name': county_name,
        'const_code': const_code,
        'const_name': const_name,
        'caw_code': caw_code,
        'caw_name': caw_name,
        'reg_centre_code': reg_centre_code,
        'reg_centre_name': reg_centre_name,
        'polling_station_code': polling_station_code,
        'polling_station_name': polling_station_name,
        'registered_voters': int(registered_voters) if registered_voters.isdigit() else 0
    }

def write_to_csv(polling_stations, output_path):
    """
    Write polling stations data to CSV file
    """
    with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = [
            'County Code', 'County Name', 'Const Code', 'Const. Name', 
            'CAW Code', 'CAW Name', 'Reg. Centre Code', 'Reg. Centre Name',
            'Polling Station Code', 'Polling Station Name', 'Registered Voters'
        ]
        
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for station in polling_stations:
            writer.writerow({
                'County Code': station['county_code'],
                'County Name': station['county_name'],
                'Const Code': station['const_code'],
                'Const. Name': station['const_name'],
                'CAW Code': station['caw_code'],
                'CAW Name': station['caw_name'],
                'Reg. Centre Code': station['reg_centre_code'],
                'Reg. Centre Name': station['reg_centre_name'],
                'Polling Station Code': station['polling_station_code'],
                'Polling Station Name': station['polling_station_name'],
                'Registered Voters': station['registered_voters']
            })

def generate_summary_report(polling_stations, output_path, total_pages):
    """
    Generate a summary report
    """
    report_path = output_path.replace('.csv', '_REPORT.md')
    
    sample_data = ""
    if polling_stations:
        sample_data = "\n".join([
            f"{station['county_code']},{station['county_name']},{station['const_code']},{station['const_name']},{station['caw_code']},{station['caw_name']},{station['reg_centre_code']},{station['reg_centre_name']},{station['polling_station_code']},{station['polling_station_name']},{station['registered_voters']}"
            for station in polling_stations[:5]
        ])
    
    report_content = f"""# Polling Station Data Extraction Report
Generated: {__import__('datetime').datetime.now().isoformat()}

## Summary
- **Total Polling Stations**: {len(polling_stations)}
- **Source PDF**: {total_pages} pages
- **Output File**: {Path(output_path).name}

## Sample Data (first 5 records)

## Notes
- Using table extraction and text parsing
- Manual verification recommended
"""
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report_content)
    
    print(f"📋 Summary report saved to: {report_path}")

def debug_page_extraction(pdf_path, page_number=1):
    """
    Debug function to examine how a specific page is being parsed
    """
    print(f"🔍 Debugging page {page_number}...")
    
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[page_number - 1]
        
        # Try table extraction
        print("📊 Table extraction:")
        tables = page.extract_tables()
        for i, table in enumerate(tables):
            print(f"Table {i+1}:")
            for j, row in enumerate(table[:3]):  # Show first 3 rows
                print(f"  Row {j}: {row}")
        
        # Try text extraction
        print("\n📝 Text extraction:")
        text = page.extract_text()
        print(f"First 200 chars: {text[:200]}...")
        
        # Show first few lines
        lines = text.split('\n')
        print(f"\nFirst 5 lines:")
        for i, line in enumerate(lines[:5]):
            print(f"Line {i}: {line}")

def main():
    """
    Main function to run the extraction
    """
    # Set up paths
    pdf_path = "requirements/polling_station.pdf"
    output_path = "extracted-data/polling_stations_python.csv"
    
    # Check if PDF exists
    if not os.path.exists(pdf_path):
        print(f"❌ PDF file not found: {pdf_path}")
        print("💡 Please ensure the PDF is in the 'requirements' folder")
        return
    
    # First, debug the first page to see how it's structured
    debug_page_extraction(pdf_path, 1)
    
    try:
        # Extract data
        stations = extract_polling_data_from_pdf(pdf_path, output_path)
        print(f"✅ Successfully converted {len(stations)} polling stations to CSV")
        
    except Exception as e:
        print(f"❌ Conversion failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()