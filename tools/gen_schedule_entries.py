#!/usr/bin/env python3
#
# gen_schedule_entries - Generate MUD schedule entries from website's TSV schedule
#
# This is a hackish tool, to be used interactively at code authoring time. It doesn't run
# as part of the live MUD. The code it generates goes in to src/components/ScheduleView.tsx,
# and will need some hand tweaking.

import argparse
import csv
import os.path
from pathlib import Path


class ScriptOpts:
  def __init__(self):
    self.infile: str | None = None

  def __str__(self):
    return f"infile={self.infile}"


def fail(msg):
  raise RuntimeError(msg)


def parse_cli():
  ap = argparse.ArgumentParser()
  ap.add_argument('infile', help='Path to the input schedule TSV file to read')
  args = ap.parse_args()

  opts = ScriptOpts()
  if args.infile is not None:
    opts.infile = args.infile
  return opts


def main():
  opts = parse_cli()
  if not opts.infile:
    fail('infile argument is required')
  indent = '  '

  # Input

  with open(opts.infile) as fh:
    csv_reader = csv.reader(fh, delimiter='\t')
    lines = list(csv_reader)
  header = lines[0]
  row_lines = lines[1:]
  rows = []
  for rl in row_lines:
    d = dict(zip(header, rl))
    # Aliasing
    d['start'] = d['start(PST)']
    rows.append(d)
  
  # Output
  for r in rows:
    day = 0 if r['date'] == 'preview' else int(r['date']) + 1
    breakout_room = ''
    rooms_arg = ''
    bkrooms_arg = ''
    if r['type'] in ('full', 'lightning', 'preview_talk'):
      rooms_arg = ", ['theater']"
      if r['speakers']:
        text = f"{r['speakers']}: {r['title']}"
      else:
        text = r['title']
      esc_text = text.replace("'", "\\'")
      text_expr = f"'{esc_text}'"
    elif r['type'] == 'social':
      text_expr = 'SOCIAL_TIME'
    elif r['type'] == 'unconferencing':
      text_expr = "'Unconferencing'"
      rooms_arg = ", ['unconferencingHub']"

    # (time, day, text, roomIds? breakoutRoomId?)
    start_time = r['start']
    print(f"{indent}ScheduleEntry('{start_time}', {day}, {text_expr}{rooms_arg}{bkrooms_arg}),")


if __name__ == '__main__':
  main()  
