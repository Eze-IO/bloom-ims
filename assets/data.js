// Seed data converted from the original SQL Server load scripts (all names are fictional).
window.SEED = {
 "trader": [
  {
   "trader_id": 1,
   "trader_name": "Dana Whitfield"
  },
  {
   "trader_id": 2,
   "trader_name": "Marco Ilves"
  },
  {
   "trader_id": 3,
   "trader_name": "Priya Nandakumar"
  }
 ],
 "warehouse": [
  {
   "warehouse_id": 1,
   "location_desc": "Bayport Logistics Hub",
   "warehouse_rate": 0.55,
   "unit_measurement_id": 1,
   "trader_id": 2
  },
  {
   "warehouse_id": 2,
   "location_desc": "Delta Bulk Terminal",
   "warehouse_rate": 0.32,
   "unit_measurement_id": 1,
   "trader_id": 2
  },
  {
   "warehouse_id": 3,
   "location_desc": "Ridgeline Distribution",
   "warehouse_rate": 0.32,
   "unit_measurement_id": 1,
   "trader_id": 1
  },
  {
   "warehouse_id": 4,
   "location_desc": "Gulf Coast Storage",
   "warehouse_rate": 0.45,
   "unit_measurement_id": 1,
   "trader_id": 3
  },
  {
   "warehouse_id": 5,
   "location_desc": "Northgate Freight Center",
   "warehouse_rate": 0.62,
   "unit_measurement_id": 1,
   "trader_id": 1
  }
 ],
 "product": [
  {
   "product_id": 1,
   "grade": "HDPE 225",
   "rc_number": 5
  },
  {
   "product_id": 2,
   "grade": "HDPE 950-EF",
   "rc_number": 8
  },
  {
   "product_id": 3,
   "grade": "LLDPE",
   "rc_number": 3
  },
  {
   "product_id": 4,
   "grade": "LLDPE",
   "rc_number": 6
  },
  {
   "product_id": 5,
   "grade": "HDPE 225",
   "rc_number": 1
  }
 ],
 "contract_type": [
  {
   "contract_type_id": 1,
   "contract_type_desc": "purchase"
  },
  {
   "contract_type_id": 2,
   "contract_type_desc": "sell"
  }
 ],
 "unit_measurement": [
  {
   "unit_measurement_id": 1,
   "unit_measurement_desc": "mt"
  },
  {
   "unit_measurement_id": 2,
   "unit_measurement_desc": "kg"
  },
  {
   "unit_measurement_id": 3,
   "unit_measurement_desc": "lbs"
  }
 ],
 "incoterms": [
  {
   "incoterms_id": 1,
   "incoterms_type": "FAS"
  },
  {
   "incoterms_id": 2,
   "incoterms_type": "CFR"
  },
  {
   "incoterms_id": 3,
   "incoterms_type": "CIF"
  },
  {
   "incoterms_id": 4,
   "incoterms_type": "FOB"
  }
 ],
 "bl_status": [
  {
   "bl_status_id": 1,
   "bl_status_type": "incoming"
  },
  {
   "bl_status_id": 2,
   "bl_status_type": "revised"
  },
  {
   "bl_status_id": 3,
   "bl_status_type": "finalized"
  },
  {
   "bl_status_id": 4,
   "bl_status_type": "arrived"
  }
 ],
 "contract_status": [
  {
   "contract_status_id": 1,
   "contract_status_desc": "initial"
  },
  {
   "contract_status_id": 2,
   "contract_status_desc": "revised"
  },
  {
   "contract_status_id": 3,
   "contract_status_desc": "complete"
  }
 ],
 "counterparty_type": [
  {
   "counterparty_type_id": 1,
   "counterparty_type_desc": "buyer"
  },
  {
   "counterparty_type_id": 2,
   "counterparty_type_desc": "seller"
  }
 ],
 "inventory_status": [
  {
   "inventory_status_id": 1,
   "inventory_status_type": "unpackaged",
   "designation": "future inventory"
  },
  {
   "inventory_status_id": 2,
   "inventory_status_type": "packaged",
   "designation": "sitting"
  }
 ],
 "agent": [
  {
   "agent_id": 1,
   "agent_commission": 7705.99,
   "agent_country": "Venezuela"
  },
  {
   "agent_id": 2,
   "agent_commission": 7151.32,
   "agent_country": "Korea, North"
  },
  {
   "agent_id": 3,
   "agent_commission": 6981.67,
   "agent_country": "United Kingdom"
  },
  {
   "agent_id": 4,
   "agent_commission": 2830.25,
   "agent_country": "Vietnam"
  },
  {
   "agent_id": 5,
   "agent_commission": 5985.95,
   "agent_country": "Sint Maarten"
  },
  {
   "agent_id": 6,
   "agent_commission": 4043.59,
   "agent_country": "El Salvador"
  },
  {
   "agent_id": 7,
   "agent_commission": 8845.81,
   "agent_country": "United States"
  },
  {
   "agent_id": 8,
   "agent_commission": 8695.49,
   "agent_country": "United Kingdom"
  },
  {
   "agent_id": 9,
   "agent_commission": 9645.82,
   "agent_country": "Kuwait"
  },
  {
   "agent_id": 10,
   "agent_commission": 2474.89,
   "agent_country": "Angola"
  },
  {
   "agent_id": 11,
   "agent_commission": 6898.16,
   "agent_country": "Martinique"
  },
  {
   "agent_id": 12,
   "agent_commission": 3675.39,
   "agent_country": "Chile"
  },
  {
   "agent_id": 13,
   "agent_commission": 1872.27,
   "agent_country": "United States"
  },
  {
   "agent_id": 14,
   "agent_commission": 5309.81,
   "agent_country": "Indonesia"
  },
  {
   "agent_id": 15,
   "agent_commission": 6966.63,
   "agent_country": "Marshall Islands"
  },
  {
   "agent_id": 16,
   "agent_commission": 6751.96,
   "agent_country": "Virgin Islands, United States"
  },
  {
   "agent_id": 17,
   "agent_commission": 4750.99,
   "agent_country": "\ufffdland Islands"
  },
  {
   "agent_id": 18,
   "agent_commission": 1897.52,
   "agent_country": "Mongolia"
  },
  {
   "agent_id": 19,
   "agent_commission": 5940.46,
   "agent_country": "Guyana"
  },
  {
   "agent_id": 20,
   "agent_commission": 7312.28,
   "agent_country": "Vietnam"
  },
  {
   "agent_id": 21,
   "agent_commission": 1261.66,
   "agent_country": "Vietnam"
  },
  {
   "agent_id": 22,
   "agent_commission": 3327.48,
   "agent_country": "United Kingdom"
  },
  {
   "agent_id": 23,
   "agent_commission": 6794.74,
   "agent_country": "Spain"
  },
  {
   "agent_id": 24,
   "agent_commission": 1689.58,
   "agent_country": "Vietnam"
  },
  {
   "agent_id": 25,
   "agent_commission": 7155.47,
   "agent_country": "Ukraine"
  },
  {
   "agent_id": 26,
   "agent_commission": 3780.69,
   "agent_country": "Hong Kong"
  },
  {
   "agent_id": 27,
   "agent_commission": 1940.09,
   "agent_country": "Hong Kong"
  },
  {
   "agent_id": 28,
   "agent_commission": 9595.77,
   "agent_country": "Vietnam"
  },
  {
   "agent_id": 29,
   "agent_commission": 3524.0,
   "agent_country": "Oman"
  },
  {
   "agent_id": 30,
   "agent_commission": 5994.84,
   "agent_country": "United States"
  }
 ],
 "contract": [
  {
   "contract_id": 1,
   "contract_type_id": null,
   "contract_date": "2020-02-29T03:33",
   "contract_status_id": 3,
   "incoterms_id": 2,
   "payment_terms_id": 14,
   "link_id": 19,
   "counterparty_id": 25,
   "agent_id": 7,
   "bl_id": 20
  },
  {
   "contract_id": 2,
   "contract_type_id": 1,
   "contract_date": "2020-01-10T00:57",
   "contract_status_id": 1,
   "incoterms_id": 4,
   "payment_terms_id": 6,
   "link_id": 25,
   "counterparty_id": 12,
   "agent_id": 1,
   "bl_id": 26
  },
  {
   "contract_id": 3,
   "contract_type_id": 1,
   "contract_date": "2020-02-05T16:02",
   "contract_status_id": 1,
   "incoterms_id": 4,
   "payment_terms_id": 11,
   "link_id": 1,
   "counterparty_id": 1,
   "agent_id": 3,
   "bl_id": 30
  },
  {
   "contract_id": 4,
   "contract_type_id": 1,
   "contract_date": "2020-01-22T03:00",
   "contract_status_id": 1,
   "incoterms_id": 2,
   "payment_terms_id": 23,
   "link_id": 22,
   "counterparty_id": 17,
   "agent_id": 11,
   "bl_id": 15
  },
  {
   "contract_id": 5,
   "contract_type_id": 1,
   "contract_date": "2020-01-21T04:14",
   "contract_status_id": 1,
   "incoterms_id": 1,
   "payment_terms_id": 22,
   "link_id": 21,
   "counterparty_id": 3,
   "agent_id": 29,
   "bl_id": 9
  },
  {
   "contract_id": 6,
   "contract_type_id": 1,
   "contract_date": "2020-01-16T13:37",
   "contract_status_id": 1,
   "incoterms_id": 4,
   "payment_terms_id": 26,
   "link_id": 11,
   "counterparty_id": 15,
   "agent_id": 16,
   "bl_id": 10
  },
  {
   "contract_id": 7,
   "contract_type_id": 1,
   "contract_date": "2020-02-12T15:57",
   "contract_status_id": 2,
   "incoterms_id": 2,
   "payment_terms_id": 18,
   "link_id": 7,
   "counterparty_id": 5,
   "agent_id": 21,
   "bl_id": 18
  },
  {
   "contract_id": 8,
   "contract_type_id": 1,
   "contract_date": "2020-01-22T03:04",
   "contract_status_id": 1,
   "incoterms_id": 4,
   "payment_terms_id": 24,
   "link_id": 30,
   "counterparty_id": 23,
   "agent_id": 14,
   "bl_id": 4
  },
  {
   "contract_id": 9,
   "contract_type_id": 1,
   "contract_date": "2020-01-01T20:25",
   "contract_status_id": 3,
   "incoterms_id": 3,
   "payment_terms_id": 27,
   "link_id": 22,
   "counterparty_id": 12,
   "agent_id": 11,
   "bl_id": 21
  },
  {
   "contract_id": 10,
   "contract_type_id": 1,
   "contract_date": "2020-02-22T21:24",
   "contract_status_id": 3,
   "incoterms_id": 2,
   "payment_terms_id": 23,
   "link_id": 14,
   "counterparty_id": 10,
   "agent_id": 26,
   "bl_id": 26
  },
  {
   "contract_id": 11,
   "contract_type_id": 1,
   "contract_date": "2020-01-08T16:35",
   "contract_status_id": 3,
   "incoterms_id": 1,
   "payment_terms_id": 5,
   "link_id": 21,
   "counterparty_id": 3,
   "agent_id": 29,
   "bl_id": 12
  },
  {
   "contract_id": 12,
   "contract_type_id": 1,
   "contract_date": "2020-02-18T15:02",
   "contract_status_id": 1,
   "incoterms_id": 4,
   "payment_terms_id": 17,
   "link_id": 14,
   "counterparty_id": 3,
   "agent_id": 11,
   "bl_id": 7
  },
  {
   "contract_id": 13,
   "contract_type_id": 1,
   "contract_date": "2020-02-02T17:56",
   "contract_status_id": 3,
   "incoterms_id": 3,
   "payment_terms_id": 4,
   "link_id": 22,
   "counterparty_id": 24,
   "agent_id": 12,
   "bl_id": 14
  },
  {
   "contract_id": 14,
   "contract_type_id": 1,
   "contract_date": "2020-02-20T11:13",
   "contract_status_id": 3,
   "incoterms_id": 3,
   "payment_terms_id": 14,
   "link_id": 15,
   "counterparty_id": 4,
   "agent_id": 10,
   "bl_id": 27
  },
  {
   "contract_id": 15,
   "contract_type_id": 1,
   "contract_date": "2020-02-02T08:57",
   "contract_status_id": 2,
   "incoterms_id": 3,
   "payment_terms_id": 30,
   "link_id": 25,
   "counterparty_id": 7,
   "agent_id": 30,
   "bl_id": 22
  },
  {
   "contract_id": 16,
   "contract_type_id": 1,
   "contract_date": "2020-03-03T10:32",
   "contract_status_id": 1,
   "incoterms_id": 3,
   "payment_terms_id": 12,
   "link_id": 11,
   "counterparty_id": 10,
   "agent_id": 4,
   "bl_id": 28
  },
  {
   "contract_id": 17,
   "contract_type_id": 1,
   "contract_date": "2020-02-19T21:42",
   "contract_status_id": 1,
   "incoterms_id": 2,
   "payment_terms_id": 21,
   "link_id": 23,
   "counterparty_id": 10,
   "agent_id": 24,
   "bl_id": 26
  },
  {
   "contract_id": 18,
   "contract_type_id": 1,
   "contract_date": "2020-01-17T11:51",
   "contract_status_id": 1,
   "incoterms_id": 3,
   "payment_terms_id": 25,
   "link_id": 8,
   "counterparty_id": 13,
   "agent_id": 2,
   "bl_id": 28
  },
  {
   "contract_id": 19,
   "contract_type_id": 1,
   "contract_date": "2020-02-02T16:14",
   "contract_status_id": 2,
   "incoterms_id": 1,
   "payment_terms_id": 13,
   "link_id": 4,
   "counterparty_id": 19,
   "agent_id": 18,
   "bl_id": 1
  },
  {
   "contract_id": 20,
   "contract_type_id": 1,
   "contract_date": "2020-01-23T16:13",
   "contract_status_id": 1,
   "incoterms_id": 3,
   "payment_terms_id": 26,
   "link_id": 29,
   "counterparty_id": 14,
   "agent_id": 24,
   "bl_id": 7
  },
  {
   "contract_id": 21,
   "contract_type_id": 1,
   "contract_date": "2020-02-27T07:59",
   "contract_status_id": 1,
   "incoterms_id": 1,
   "payment_terms_id": 3,
   "link_id": 7,
   "counterparty_id": 16,
   "agent_id": 14,
   "bl_id": 24
  },
  {
   "contract_id": 22,
   "contract_type_id": 1,
   "contract_date": "2020-01-19T15:26",
   "contract_status_id": 2,
   "incoterms_id": 3,
   "payment_terms_id": 3,
   "link_id": 26,
   "counterparty_id": 2,
   "agent_id": 14,
   "bl_id": 29
  },
  {
   "contract_id": 23,
   "contract_type_id": 1,
   "contract_date": "2020-02-10T13:04",
   "contract_status_id": 1,
   "incoterms_id": 4,
   "payment_terms_id": 15,
   "link_id": 7,
   "counterparty_id": 5,
   "agent_id": 28,
   "bl_id": 13
  },
  {
   "contract_id": 24,
   "contract_type_id": 1,
   "contract_date": "2020-01-28T15:59",
   "contract_status_id": 2,
   "incoterms_id": 3,
   "payment_terms_id": 16,
   "link_id": 28,
   "counterparty_id": 4,
   "agent_id": 15,
   "bl_id": 9
  },
  {
   "contract_id": 25,
   "contract_type_id": 1,
   "contract_date": "2020-02-15T00:24",
   "contract_status_id": 3,
   "incoterms_id": 4,
   "payment_terms_id": 10,
   "link_id": 3,
   "counterparty_id": 18,
   "agent_id": 3,
   "bl_id": 8
  },
  {
   "contract_id": 26,
   "contract_type_id": 1,
   "contract_date": "2020-01-27T04:59",
   "contract_status_id": 3,
   "incoterms_id": 2,
   "payment_terms_id": 17,
   "link_id": 21,
   "counterparty_id": 13,
   "agent_id": 22,
   "bl_id": 26
  },
  {
   "contract_id": 27,
   "contract_type_id": 1,
   "contract_date": "2020-02-21T01:11",
   "contract_status_id": 2,
   "incoterms_id": 4,
   "payment_terms_id": 10,
   "link_id": 3,
   "counterparty_id": 10,
   "agent_id": 17,
   "bl_id": 16
  },
  {
   "contract_id": 28,
   "contract_type_id": 1,
   "contract_date": "2020-01-23T02:59",
   "contract_status_id": 3,
   "incoterms_id": 1,
   "payment_terms_id": 8,
   "link_id": 20,
   "counterparty_id": 16,
   "agent_id": 15,
   "bl_id": 2
  },
  {
   "contract_id": 29,
   "contract_type_id": 1,
   "contract_date": "2020-02-11T06:49",
   "contract_status_id": 1,
   "incoterms_id": 4,
   "payment_terms_id": 9,
   "link_id": 13,
   "counterparty_id": 6,
   "agent_id": 29,
   "bl_id": 10
  },
  {
   "contract_id": 30,
   "contract_type_id": 1,
   "contract_date": "2020-01-10T21:41",
   "contract_status_id": 3,
   "incoterms_id": 3,
   "payment_terms_id": 27,
   "link_id": 28,
   "counterparty_id": 4,
   "agent_id": 14,
   "bl_id": 25
  },
  {
   "contract_id": 31,
   "contract_type_id": 1,
   "contract_date": "2020-02-17T05:00",
   "contract_status_id": 3,
   "incoterms_id": 2,
   "payment_terms_id": 7,
   "link_id": 22,
   "counterparty_id": 13,
   "agent_id": 3,
   "bl_id": 3
  },
  {
   "contract_id": 32,
   "contract_type_id": 2,
   "contract_date": "2020-01-28T02:25",
   "contract_status_id": 1,
   "incoterms_id": 4,
   "payment_terms_id": 9,
   "link_id": 21,
   "counterparty_id": 22,
   "agent_id": 23,
   "bl_id": 12
  },
  {
   "contract_id": 33,
   "contract_type_id": 2,
   "contract_date": "2020-01-12T17:43",
   "contract_status_id": 2,
   "incoterms_id": 1,
   "payment_terms_id": 7,
   "link_id": 18,
   "counterparty_id": 15,
   "agent_id": 14,
   "bl_id": 27
  },
  {
   "contract_id": 34,
   "contract_type_id": 2,
   "contract_date": "2020-01-31T12:00",
   "contract_status_id": 2,
   "incoterms_id": 3,
   "payment_terms_id": 22,
   "link_id": 14,
   "counterparty_id": 19,
   "agent_id": 16,
   "bl_id": 14
  },
  {
   "contract_id": 35,
   "contract_type_id": 2,
   "contract_date": "2020-03-05T12:52",
   "contract_status_id": 3,
   "incoterms_id": 3,
   "payment_terms_id": 15,
   "link_id": 24,
   "counterparty_id": 6,
   "agent_id": 29,
   "bl_id": 11
  },
  {
   "contract_id": 36,
   "contract_type_id": 2,
   "contract_date": "2020-01-26T15:16",
   "contract_status_id": 1,
   "incoterms_id": 3,
   "payment_terms_id": 29,
   "link_id": 2,
   "counterparty_id": 7,
   "agent_id": 18,
   "bl_id": 11
  },
  {
   "contract_id": 37,
   "contract_type_id": 2,
   "contract_date": "2020-01-11T06:03",
   "contract_status_id": 1,
   "incoterms_id": 3,
   "payment_terms_id": 29,
   "link_id": 2,
   "counterparty_id": 12,
   "agent_id": 2,
   "bl_id": 23
  },
  {
   "contract_id": 38,
   "contract_type_id": 2,
   "contract_date": "2020-02-27T06:31",
   "contract_status_id": 3,
   "incoterms_id": 2,
   "payment_terms_id": 13,
   "link_id": 30,
   "counterparty_id": 5,
   "agent_id": 23,
   "bl_id": 6
  },
  {
   "contract_id": 39,
   "contract_type_id": 2,
   "contract_date": "2020-02-26T09:41",
   "contract_status_id": 3,
   "incoterms_id": 4,
   "payment_terms_id": 23,
   "link_id": 12,
   "counterparty_id": 21,
   "agent_id": 30,
   "bl_id": 3
  },
  {
   "contract_id": 40,
   "contract_type_id": 2,
   "contract_date": "2020-02-11T08:20",
   "contract_status_id": 3,
   "incoterms_id": 3,
   "payment_terms_id": 15,
   "link_id": 2,
   "counterparty_id": 16,
   "agent_id": 25,
   "bl_id": 17
  },
  {
   "contract_id": 41,
   "contract_type_id": 2,
   "contract_date": "2020-03-05T21:41",
   "contract_status_id": 3,
   "incoterms_id": 4,
   "payment_terms_id": 11,
   "link_id": 17,
   "counterparty_id": 3,
   "agent_id": 24,
   "bl_id": 4
  },
  {
   "contract_id": 42,
   "contract_type_id": 2,
   "contract_date": "2020-03-02T19:06",
   "contract_status_id": 1,
   "incoterms_id": 4,
   "payment_terms_id": 9,
   "link_id": 15,
   "counterparty_id": 24,
   "agent_id": 3,
   "bl_id": 11
  },
  {
   "contract_id": 43,
   "contract_type_id": 2,
   "contract_date": "2020-01-09T11:00",
   "contract_status_id": 1,
   "incoterms_id": 2,
   "payment_terms_id": 27,
   "link_id": 9,
   "counterparty_id": 25,
   "agent_id": 3,
   "bl_id": 22
  },
  {
   "contract_id": 44,
   "contract_type_id": 2,
   "contract_date": "2020-02-22T20:18",
   "contract_status_id": 3,
   "incoterms_id": 4,
   "payment_terms_id": 1,
   "link_id": 16,
   "counterparty_id": 7,
   "agent_id": 20,
   "bl_id": 15
  },
  {
   "contract_id": 45,
   "contract_type_id": 2,
   "contract_date": "2020-01-23T17:55",
   "contract_status_id": 2,
   "incoterms_id": 3,
   "payment_terms_id": 11,
   "link_id": 6,
   "counterparty_id": 5,
   "agent_id": 13,
   "bl_id": 24
  },
  {
   "contract_id": 46,
   "contract_type_id": 2,
   "contract_date": "2020-01-14T16:48",
   "contract_status_id": 2,
   "incoterms_id": 1,
   "payment_terms_id": 23,
   "link_id": 17,
   "counterparty_id": 18,
   "agent_id": 14,
   "bl_id": 3
  },
  {
   "contract_id": 47,
   "contract_type_id": 2,
   "contract_date": "2020-01-24T05:17",
   "contract_status_id": 3,
   "incoterms_id": 4,
   "payment_terms_id": 21,
   "link_id": 16,
   "counterparty_id": 25,
   "agent_id": 10,
   "bl_id": 27
  },
  {
   "contract_id": 48,
   "contract_type_id": 2,
   "contract_date": "2020-02-22T21:37",
   "contract_status_id": 1,
   "incoterms_id": 1,
   "payment_terms_id": 7,
   "link_id": 18,
   "counterparty_id": 1,
   "agent_id": 30,
   "bl_id": 4
  },
  {
   "contract_id": 49,
   "contract_type_id": 2,
   "contract_date": "2020-01-23T16:46",
   "contract_status_id": 2,
   "incoterms_id": 3,
   "payment_terms_id": 8,
   "link_id": 13,
   "counterparty_id": 16,
   "agent_id": 27,
   "bl_id": 28
  },
  {
   "contract_id": 50,
   "contract_type_id": 2,
   "contract_date": "2020-02-02T20:26",
   "contract_status_id": 1,
   "incoterms_id": 4,
   "payment_terms_id": 26,
   "link_id": 13,
   "counterparty_id": 12,
   "agent_id": 12,
   "bl_id": 27
  },
  {
   "contract_id": 51,
   "contract_type_id": 2,
   "contract_date": "2020-02-04T17:15",
   "contract_status_id": 2,
   "incoterms_id": 1,
   "payment_terms_id": 14,
   "link_id": 9,
   "counterparty_id": 20,
   "agent_id": 28,
   "bl_id": 6
  },
  {
   "contract_id": 52,
   "contract_type_id": 2,
   "contract_date": "2020-01-12T01:21",
   "contract_status_id": 1,
   "incoterms_id": 4,
   "payment_terms_id": 20,
   "link_id": 6,
   "counterparty_id": 14,
   "agent_id": 26,
   "bl_id": 10
  },
  {
   "contract_id": 53,
   "contract_type_id": 2,
   "contract_date": "2020-01-07T08:49",
   "contract_status_id": 2,
   "incoterms_id": 1,
   "payment_terms_id": 3,
   "link_id": 10,
   "counterparty_id": 3,
   "agent_id": 14,
   "bl_id": 25
  },
  {
   "contract_id": 54,
   "contract_type_id": 2,
   "contract_date": "2020-01-10T08:26",
   "contract_status_id": 3,
   "incoterms_id": 3,
   "payment_terms_id": 25,
   "link_id": 11,
   "counterparty_id": 22,
   "agent_id": 23,
   "bl_id": 11
  },
  {
   "contract_id": 55,
   "contract_type_id": 2,
   "contract_date": "2020-01-30T13:29",
   "contract_status_id": 1,
   "incoterms_id": 2,
   "payment_terms_id": 5,
   "link_id": 12,
   "counterparty_id": 3,
   "agent_id": 11,
   "bl_id": 8
  },
  {
   "contract_id": 56,
   "contract_type_id": 2,
   "contract_date": "2020-03-04T08:57",
   "contract_status_id": 2,
   "incoterms_id": 2,
   "payment_terms_id": 29,
   "link_id": 1,
   "counterparty_id": 4,
   "agent_id": 26,
   "bl_id": 14
  },
  {
   "contract_id": 57,
   "contract_type_id": 2,
   "contract_date": "2020-01-14T16:18",
   "contract_status_id": 2,
   "incoterms_id": 1,
   "payment_terms_id": 19,
   "link_id": 6,
   "counterparty_id": 18,
   "agent_id": 16,
   "bl_id": 17
  },
  {
   "contract_id": 58,
   "contract_type_id": 2,
   "contract_date": "2020-01-08T21:47",
   "contract_status_id": 3,
   "incoterms_id": 3,
   "payment_terms_id": 19,
   "link_id": 22,
   "counterparty_id": 8,
   "agent_id": 14,
   "bl_id": 18
  },
  {
   "contract_id": 59,
   "contract_type_id": 2,
   "contract_date": "2020-01-14T20:26",
   "contract_status_id": 2,
   "incoterms_id": 3,
   "payment_terms_id": 15,
   "link_id": 4,
   "counterparty_id": 7,
   "agent_id": 20,
   "bl_id": 27
  },
  {
   "contract_id": 60,
   "contract_type_id": 2,
   "contract_date": "2020-01-15T21:25",
   "contract_status_id": 2,
   "incoterms_id": 1,
   "payment_terms_id": 22,
   "link_id": 12,
   "counterparty_id": 3,
   "agent_id": 28,
   "bl_id": 27
  }
 ],
 "contract_details": [
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 102.57,
   "unit_measurement_id": 1,
   "contract_price": 7026.06
  },
  {
   "contract_product": "LLDPE",
   "contract_quantity": 102.57,
   "unit_measurement_id": 2,
   "contract_price": 5780.26
  },
  {
   "contract_product": "HDPE 2285",
   "contract_quantity": 102.57,
   "unit_measurement_id": 1,
   "contract_price": 2603.22
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 200.57,
   "unit_measurement_id": 2,
   "contract_price": 1586.82
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 200.57,
   "unit_measurement_id": 1,
   "contract_price": 9159.64
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 200.57,
   "unit_measurement_id": 2,
   "contract_price": 9579.64
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 102.57,
   "unit_measurement_id": 1,
   "contract_price": 2669.64
  },
  {
   "contract_product": "HDPE 2285",
   "contract_quantity": 102.57,
   "unit_measurement_id": 2,
   "contract_price": 7424.03
  },
  {
   "contract_product": "HDPE 2286",
   "contract_quantity": 102.57,
   "unit_measurement_id": 1,
   "contract_price": 4791.4
  },
  {
   "contract_product": "HDPE 2287",
   "contract_quantity": 102.57,
   "unit_measurement_id": 2,
   "contract_price": 9321.23
  },
  {
   "contract_product": "HDPE 2288",
   "contract_quantity": 116.85,
   "unit_measurement_id": 1,
   "contract_price": 6241.62
  },
  {
   "contract_product": "HDPE 2289",
   "contract_quantity": 181.55,
   "unit_measurement_id": 2,
   "contract_price": 4218.17
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 181.55,
   "unit_measurement_id": 1,
   "contract_price": 9423.45
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 181.55,
   "unit_measurement_id": 2,
   "contract_price": 1798.63
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 181.55,
   "unit_measurement_id": 1,
   "contract_price": 7763.08
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 181.55,
   "unit_measurement_id": 2,
   "contract_price": 6500.0
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 181.55,
   "unit_measurement_id": 1,
   "contract_price": 8289.69
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 102.57,
   "unit_measurement_id": 2,
   "contract_price": 6748.43
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 102.57,
   "unit_measurement_id": 1,
   "contract_price": 7085.95
  },
  {
   "contract_product": "HDPE 950-EF",
   "contract_quantity": 100.57,
   "unit_measurement_id": 2,
   "contract_price": 8944.5
  },
  {
   "contract_product": "LLDPE",
   "contract_quantity": 100.57,
   "unit_measurement_id": 1,
   "contract_price": 1580.92
  },
  {
   "contract_product": "LLDPE",
   "contract_quantity": 100.57,
   "unit_measurement_id": 2,
   "contract_price": 2379.24
  },
  {
   "contract_product": "LLDPE",
   "contract_quantity": 100.57,
   "unit_measurement_id": 1,
   "contract_price": 6425.36
  },
  {
   "contract_product": "LLDPE",
   "contract_quantity": 102.57,
   "unit_measurement_id": 2,
   "contract_price": 6388.83
  },
  {
   "contract_product": "LLDPE",
   "contract_quantity": 102.57,
   "unit_measurement_id": 1,
   "contract_price": 3202.95
  },
  {
   "contract_product": "LLDPE",
   "contract_quantity": 102.57,
   "unit_measurement_id": 2,
   "contract_price": 6521.03
  },
  {
   "contract_product": "LLDPE",
   "contract_quantity": 102.57,
   "unit_measurement_id": 1,
   "contract_price": 5504.63
  },
  {
   "contract_product": "LLDPE",
   "contract_quantity": 102.57,
   "unit_measurement_id": 2,
   "contract_price": 6043.29
  },
  {
   "contract_product": "LLDPE",
   "contract_quantity": 102.57,
   "unit_measurement_id": 1,
   "contract_price": 1181.53
  },
  {
   "contract_product": "LLDPE",
   "contract_quantity": 102.57,
   "unit_measurement_id": 2,
   "contract_price": 8305.72
  }
 ],
 "counterparty": [
  {
   "counterparty_id": 1,
   "counterparty_type_id": 1,
   "counterparty_name": "Waters, Schroeder and Kemmer"
  },
  {
   "counterparty_id": 2,
   "counterparty_type_id": 2,
   "counterparty_name": "Tremblay, Towne and Herzog"
  },
  {
   "counterparty_id": 3,
   "counterparty_type_id": 1,
   "counterparty_name": "Kerluke, Denesik and Kris"
  },
  {
   "counterparty_id": 4,
   "counterparty_type_id": 2,
   "counterparty_name": "Kreiger Inc"
  },
  {
   "counterparty_id": 5,
   "counterparty_type_id": 1,
   "counterparty_name": "Zulauf-Mraz"
  },
  {
   "counterparty_id": 6,
   "counterparty_type_id": 2,
   "counterparty_name": "Luettgen and Sons"
  },
  {
   "counterparty_id": 7,
   "counterparty_type_id": 2,
   "counterparty_name": "Farrell, Thiel and Gerlach"
  },
  {
   "counterparty_id": 8,
   "counterparty_type_id": 2,
   "counterparty_name": "Howell-Schaefer"
  },
  {
   "counterparty_id": 9,
   "counterparty_type_id": 2,
   "counterparty_name": "Simonis-Abbott"
  },
  {
   "counterparty_id": 10,
   "counterparty_type_id": 2,
   "counterparty_name": "Wiegand, Langworth and Murphy"
  },
  {
   "counterparty_id": 11,
   "counterparty_type_id": 1,
   "counterparty_name": "Kshlerin-Daugherty"
  },
  {
   "counterparty_id": 12,
   "counterparty_type_id": 1,
   "counterparty_name": "Hudson, Sipes and Davis"
  },
  {
   "counterparty_id": 13,
   "counterparty_type_id": 1,
   "counterparty_name": "Auer and Sons"
  },
  {
   "counterparty_id": 14,
   "counterparty_type_id": 1,
   "counterparty_name": "Crooks Inc"
  },
  {
   "counterparty_id": 15,
   "counterparty_type_id": 1,
   "counterparty_name": "Farrell-Okuneva"
  },
  {
   "counterparty_id": 16,
   "counterparty_type_id": 1,
   "counterparty_name": "Ritchie-Sauer"
  },
  {
   "counterparty_id": 17,
   "counterparty_type_id": 2,
   "counterparty_name": "Schaden-Dickens"
  },
  {
   "counterparty_id": 18,
   "counterparty_type_id": 1,
   "counterparty_name": "Jast, Schiller and Roberts"
  },
  {
   "counterparty_id": 19,
   "counterparty_type_id": 2,
   "counterparty_name": "Dickinson, Walker and White"
  },
  {
   "counterparty_id": 20,
   "counterparty_type_id": 1,
   "counterparty_name": "O'Connell, Lehner and Kohler"
  },
  {
   "counterparty_id": 21,
   "counterparty_type_id": 2,
   "counterparty_name": "Upton LLC"
  },
  {
   "counterparty_id": 22,
   "counterparty_type_id": 2,
   "counterparty_name": "Mertz Inc"
  },
  {
   "counterparty_id": 23,
   "counterparty_type_id": 1,
   "counterparty_name": "Lind Inc"
  },
  {
   "counterparty_id": 24,
   "counterparty_type_id": 2,
   "counterparty_name": "Larson-Walker"
  },
  {
   "counterparty_id": 25,
   "counterparty_type_id": 2,
   "counterparty_name": "Daniel-Pagac"
  }
 ],
 "inventory": [
  {
   "inventory_id": 1,
   "product_id": 4,
   "warehouse_id": 4,
   "quantity": 124.05,
   "received_date": "2020-01-26T13:01",
   "release_date": "2020-02-26T17:53"
  },
  {
   "inventory_id": 2,
   "product_id": 2,
   "warehouse_id": 3,
   "quantity": 99.44,
   "received_date": "2020-01-07T23:22",
   "release_date": "2020-02-20T14:57"
  },
  {
   "inventory_id": 3,
   "product_id": 2,
   "warehouse_id": 1,
   "quantity": 101.7,
   "received_date": "2020-02-03T05:29",
   "release_date": "2020-02-17T21:32"
  },
  {
   "inventory_id": 4,
   "product_id": 1,
   "warehouse_id": 4,
   "quantity": 157.87,
   "received_date": "2020-01-08T15:44",
   "release_date": "2020-03-06T08:15"
  },
  {
   "inventory_id": 5,
   "product_id": 5,
   "warehouse_id": 2,
   "quantity": 98.57,
   "received_date": "2020-01-09T00:42",
   "release_date": "2020-02-09T18:30"
  },
  {
   "inventory_id": 6,
   "product_id": 3,
   "warehouse_id": 3,
   "quantity": 117.59,
   "received_date": "2020-01-15T22:28",
   "release_date": "2020-03-05T10:24"
  },
  {
   "inventory_id": 7,
   "product_id": 4,
   "warehouse_id": 5,
   "quantity": 121.08,
   "received_date": "2020-01-09T22:55",
   "release_date": "2020-02-22T08:51"
  },
  {
   "inventory_id": 8,
   "product_id": 5,
   "warehouse_id": 2,
   "quantity": 92.86,
   "received_date": "2020-01-25T07:01",
   "release_date": "2020-02-20T02:45"
  },
  {
   "inventory_id": 9,
   "product_id": 1,
   "warehouse_id": 3,
   "quantity": 186.87,
   "received_date": "2020-01-04T09:32",
   "release_date": "2020-02-29T06:10"
  },
  {
   "inventory_id": 10,
   "product_id": 1,
   "warehouse_id": 1,
   "quantity": 63.93,
   "received_date": "2020-01-16T22:18",
   "release_date": "2020-02-11T17:39"
  },
  {
   "inventory_id": 11,
   "product_id": 2,
   "warehouse_id": 3,
   "quantity": 183.58,
   "received_date": "2020-01-06T06:11",
   "release_date": "2020-03-06T09:35"
  },
  {
   "inventory_id": 12,
   "product_id": 4,
   "warehouse_id": 2,
   "quantity": 77.68,
   "received_date": "2020-01-10T21:43",
   "release_date": "2020-03-07T23:33"
  },
  {
   "inventory_id": 13,
   "product_id": 3,
   "warehouse_id": 2,
   "quantity": 130.28,
   "received_date": "2020-01-20T10:54",
   "release_date": "2020-02-12T21:07"
  },
  {
   "inventory_id": 14,
   "product_id": 1,
   "warehouse_id": 1,
   "quantity": 189.84,
   "received_date": "2020-01-01T10:39",
   "release_date": "2020-02-18T04:11"
  },
  {
   "inventory_id": 15,
   "product_id": 5,
   "warehouse_id": 1,
   "quantity": 61.14,
   "received_date": "2020-01-12T21:36",
   "release_date": "2020-02-22T03:54"
  },
  {
   "inventory_id": 16,
   "product_id": 2,
   "warehouse_id": 5,
   "quantity": 78.74,
   "received_date": "2020-02-01T05:13",
   "release_date": "2020-03-01T18:41"
  },
  {
   "inventory_id": 17,
   "product_id": 1,
   "warehouse_id": 4,
   "quantity": 185,
   "received_date": "2020-01-05T10:48",
   "release_date": "2020-02-16T16:47"
  },
  {
   "inventory_id": 18,
   "product_id": 1,
   "warehouse_id": 3,
   "quantity": 187.43,
   "received_date": "2020-01-18T10:11",
   "release_date": "2020-02-12T09:48"
  },
  {
   "inventory_id": 19,
   "product_id": 5,
   "warehouse_id": 5,
   "quantity": 150.66,
   "received_date": "2020-01-19T03:18",
   "release_date": "2020-02-29T13:10"
  },
  {
   "inventory_id": 20,
   "product_id": 3,
   "warehouse_id": 2,
   "quantity": 180.55,
   "received_date": "2020-01-31T05:06",
   "release_date": "2020-02-19T14:11"
  },
  {
   "inventory_id": 21,
   "product_id": 2,
   "warehouse_id": 2,
   "quantity": 96.31,
   "received_date": "2020-01-24T08:17",
   "release_date": "2020-03-05T15:00"
  },
  {
   "inventory_id": 22,
   "product_id": 4,
   "warehouse_id": 4,
   "quantity": 136.14,
   "received_date": "2020-01-28T21:16",
   "release_date": "2020-02-25T18:07"
  },
  {
   "inventory_id": 23,
   "product_id": 4,
   "warehouse_id": 3,
   "quantity": 190.94,
   "received_date": "2020-01-29T03:18",
   "release_date": "2020-03-06T14:02"
  },
  {
   "inventory_id": 24,
   "product_id": 5,
   "warehouse_id": 2,
   "quantity": 198.6,
   "received_date": "2020-01-04T22:07",
   "release_date": "2020-02-11T06:51"
  },
  {
   "inventory_id": 25,
   "product_id": 3,
   "warehouse_id": 1,
   "quantity": 179.56,
   "received_date": "2020-01-23T13:43",
   "release_date": "2020-02-15T06:31"
  }
 ],
 "payment_terms": [
  {
   "payment_terms_id": 1,
   "shipment_date": "2020-02-25T21:33",
   "payment_terms_type": "20/80"
  },
  {
   "payment_terms_id": 2,
   "shipment_date": "2020-02-10T16:19",
   "payment_terms_type": "30/70"
  },
  {
   "payment_terms_id": 3,
   "shipment_date": "2020-01-23T04:07",
   "payment_terms_type": "20/80"
  },
  {
   "payment_terms_id": 4,
   "shipment_date": "2020-02-12T22:08",
   "payment_terms_type": "LC"
  },
  {
   "payment_terms_id": 5,
   "shipment_date": "2020-02-11T05:06",
   "payment_terms_type": "100"
  },
  {
   "payment_terms_id": 6,
   "shipment_date": "2020-02-18T23:32",
   "payment_terms_type": "LC"
  },
  {
   "payment_terms_id": 7,
   "shipment_date": "2020-02-24T13:16",
   "payment_terms_type": "100"
  },
  {
   "payment_terms_id": 8,
   "shipment_date": "2020-02-29T22:18",
   "payment_terms_type": "30/70"
  },
  {
   "payment_terms_id": 9,
   "shipment_date": "2020-01-14T07:23",
   "payment_terms_type": "20/80"
  },
  {
   "payment_terms_id": 10,
   "shipment_date": "2020-01-16T20:17",
   "payment_terms_type": "LC"
  },
  {
   "payment_terms_id": 11,
   "shipment_date": "2020-01-31T03:00",
   "payment_terms_type": "100"
  },
  {
   "payment_terms_id": 12,
   "shipment_date": "2020-01-28T05:31",
   "payment_terms_type": "30/71"
  },
  {
   "payment_terms_id": 13,
   "shipment_date": "2020-02-14T02:08",
   "payment_terms_type": "20/81"
  },
  {
   "payment_terms_id": 14,
   "shipment_date": "2020-02-13T03:57",
   "payment_terms_type": "LC"
  },
  {
   "payment_terms_id": 15,
   "shipment_date": "2020-02-10T12:54",
   "payment_terms_type": "100"
  },
  {
   "payment_terms_id": 16,
   "shipment_date": "2020-03-01T23:43",
   "payment_terms_type": "30/72"
  },
  {
   "payment_terms_id": 17,
   "shipment_date": "2020-01-01T18:56",
   "payment_terms_type": "20/82"
  },
  {
   "payment_terms_id": 18,
   "shipment_date": "2020-01-11T16:39",
   "payment_terms_type": "LC"
  },
  {
   "payment_terms_id": 19,
   "shipment_date": "2020-03-06T06:18",
   "payment_terms_type": "LC"
  },
  {
   "payment_terms_id": 20,
   "shipment_date": "2020-02-17T07:22",
   "payment_terms_type": "100"
  },
  {
   "payment_terms_id": 21,
   "shipment_date": "2020-03-03T13:14",
   "payment_terms_type": "30/71"
  },
  {
   "payment_terms_id": 22,
   "shipment_date": "2020-02-26T01:48",
   "payment_terms_type": "20/81"
  },
  {
   "payment_terms_id": 23,
   "shipment_date": "2020-01-13T23:12",
   "payment_terms_type": "LC"
  },
  {
   "payment_terms_id": 24,
   "shipment_date": "2020-01-29T13:42",
   "payment_terms_type": "100"
  },
  {
   "payment_terms_id": 25,
   "shipment_date": "2020-03-02T23:22",
   "payment_terms_type": "30/72"
  },
  {
   "payment_terms_id": 26,
   "shipment_date": "2020-01-28T01:45",
   "payment_terms_type": "20/82"
  },
  {
   "payment_terms_id": 27,
   "shipment_date": "2020-02-28T19:40",
   "payment_terms_type": "LC"
  },
  {
   "payment_terms_id": 28,
   "shipment_date": "2020-01-12T03:33",
   "payment_terms_type": "LC"
  },
  {
   "payment_terms_id": 29,
   "shipment_date": "2020-01-12T08:12",
   "payment_terms_type": "100"
  },
  {
   "payment_terms_id": 30,
   "shipment_date": "2020-02-04T14:35",
   "payment_terms_type": "30/71"
  }
 ],
 "schedule": [
  {
   "trucker_id": 25,
   "warehouse_id": 4
  },
  {
   "trucker_id": 22,
   "warehouse_id": 4
  },
  {
   "trucker_id": 2,
   "warehouse_id": 5
  },
  {
   "trucker_id": 3,
   "warehouse_id": 3
  },
  {
   "trucker_id": 18,
   "warehouse_id": 2
  },
  {
   "trucker_id": 7,
   "warehouse_id": 5
  },
  {
   "trucker_id": 5,
   "warehouse_id": 2
  },
  {
   "trucker_id": 11,
   "warehouse_id": 5
  },
  {
   "trucker_id": 13,
   "warehouse_id": 1
  },
  {
   "trucker_id": 16,
   "warehouse_id": 4
  },
  {
   "trucker_id": 3,
   "warehouse_id": 4
  },
  {
   "trucker_id": 11,
   "warehouse_id": 2
  },
  {
   "trucker_id": 29,
   "warehouse_id": 2
  },
  {
   "trucker_id": 15,
   "warehouse_id": 1
  },
  {
   "trucker_id": 2,
   "warehouse_id": 1
  },
  {
   "trucker_id": 15,
   "warehouse_id": 2
  },
  {
   "trucker_id": 23,
   "warehouse_id": 1
  },
  {
   "trucker_id": 23,
   "warehouse_id": 5
  },
  {
   "trucker_id": 3,
   "warehouse_id": 3
  },
  {
   "trucker_id": 3,
   "warehouse_id": 3
  },
  {
   "trucker_id": 25,
   "warehouse_id": 3
  },
  {
   "trucker_id": 9,
   "warehouse_id": 3
  },
  {
   "trucker_id": 6,
   "warehouse_id": 3
  },
  {
   "trucker_id": 19,
   "warehouse_id": 5
  },
  {
   "trucker_id": 24,
   "warehouse_id": 5
  },
  {
   "trucker_id": 12,
   "warehouse_id": 2
  },
  {
   "trucker_id": 2,
   "warehouse_id": 2
  },
  {
   "trucker_id": 4,
   "warehouse_id": 1
  },
  {
   "trucker_id": 2,
   "warehouse_id": 2
  },
  {
   "trucker_id": 5,
   "warehouse_id": 5
  }
 ],
 "trucker": [
  {
   "trucker_id": 1,
   "rate": 687.63,
   "company": "Wordpedia",
   "warehouse_id": 2
  },
  {
   "trucker_id": 2,
   "rate": 676.49,
   "company": "Reallinks",
   "warehouse_id": 4
  },
  {
   "trucker_id": 3,
   "rate": 698.7,
   "company": "Youbridge",
   "warehouse_id": 1
  },
  {
   "trucker_id": 4,
   "rate": 656.44,
   "company": "Ainyx",
   "warehouse_id": 5
  },
  {
   "trucker_id": 5,
   "rate": 660.23,
   "company": "Kwilith",
   "warehouse_id": 1
  },
  {
   "trucker_id": 6,
   "rate": 575.61,
   "company": "Flipstorm",
   "warehouse_id": 4
  },
  {
   "trucker_id": 7,
   "rate": 627.72,
   "company": "Zoomzone",
   "warehouse_id": 2
  },
  {
   "trucker_id": 8,
   "rate": 662.58,
   "company": "Demimbu",
   "warehouse_id": 2
  },
  {
   "trucker_id": 9,
   "rate": 587.54,
   "company": "Katz",
   "warehouse_id": 1
  },
  {
   "trucker_id": 10,
   "rate": 546.52,
   "company": "Flashpoint",
   "warehouse_id": 1
  },
  {
   "trucker_id": 11,
   "rate": 575.03,
   "company": "Demizz",
   "warehouse_id": 2
  },
  {
   "trucker_id": 12,
   "rate": 620.31,
   "company": "Devcast",
   "warehouse_id": 1
  },
  {
   "trucker_id": 13,
   "rate": 540.37,
   "company": "Skinte",
   "warehouse_id": 2
  },
  {
   "trucker_id": 14,
   "rate": 647.01,
   "company": "Lajo",
   "warehouse_id": 4
  },
  {
   "trucker_id": 15,
   "rate": 538.95,
   "company": "Lazzy",
   "warehouse_id": 1
  },
  {
   "trucker_id": 16,
   "rate": 574.2,
   "company": "Jetpulse",
   "warehouse_id": 4
  },
  {
   "trucker_id": 17,
   "rate": 583.53,
   "company": "Dablist",
   "warehouse_id": 3
  },
  {
   "trucker_id": 18,
   "rate": 512.29,
   "company": "Wordify",
   "warehouse_id": 3
  },
  {
   "trucker_id": 19,
   "rate": 593.72,
   "company": "Innojam",
   "warehouse_id": 3
  },
  {
   "trucker_id": 20,
   "rate": 596.36,
   "company": "Linktype",
   "warehouse_id": 1
  },
  {
   "trucker_id": 21,
   "rate": 663.84,
   "company": "Yodel",
   "warehouse_id": 2
  },
  {
   "trucker_id": 22,
   "rate": 568.9,
   "company": "Jabbersphere",
   "warehouse_id": 1
  },
  {
   "trucker_id": 23,
   "rate": 522.12,
   "company": "Skippad",
   "warehouse_id": 4
  },
  {
   "trucker_id": 24,
   "rate": 633.07,
   "company": "Livefish",
   "warehouse_id": 2
  },
  {
   "trucker_id": 25,
   "rate": 691.73,
   "company": "Flipbug",
   "warehouse_id": 3
  },
  {
   "trucker_id": 26,
   "rate": 587.21,
   "company": "Shuffledrive",
   "warehouse_id": 3
  },
  {
   "trucker_id": 27,
   "rate": 552.96,
   "company": "Jabbersphere",
   "warehouse_id": 2
  },
  {
   "trucker_id": 28,
   "rate": 580.57,
   "company": "Blogtag",
   "warehouse_id": 5
  },
  {
   "trucker_id": 29,
   "rate": 663.42,
   "company": "Zazio",
   "warehouse_id": 2
  },
  {
   "trucker_id": 30,
   "rate": 670.83,
   "company": "Roodel",
   "warehouse_id": 3
  }
 ],
 "bl": [
  {
   "bl_id": 1,
   "bl_status_id": 1,
   "vessel": "MSC Jeff",
   "booking_number": "038HOU59",
   "port_of_discharge": "Haiphong Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-01"
  },
  {
   "bl_id": 2,
   "bl_status_id": 2,
   "vessel": "Maerks Jacob",
   "booking_number": "038HOU60",
   "port_of_discharge": "Shanghai Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-02"
  },
  {
   "bl_id": 3,
   "bl_status_id": 3,
   "vessel": "MSC Jeff",
   "booking_number": "038HOU61",
   "port_of_discharge": "Sines Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-03"
  },
  {
   "bl_id": 4,
   "bl_status_id": 4,
   "vessel": "Maerks Jacob",
   "booking_number": "038HOU62",
   "port_of_discharge": "Izmir Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-04"
  },
  {
   "bl_id": 5,
   "bl_status_id": 5,
   "vessel": "MSC Vanessa",
   "booking_number": "038HOU63",
   "port_of_discharge": "Shanghai Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-05"
  },
  {
   "bl_id": 6,
   "bl_status_id": 1,
   "vessel": "Maerks Jacob",
   "booking_number": "038HOU64",
   "port_of_discharge": "Haiphong Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-06"
  },
  {
   "bl_id": 7,
   "bl_status_id": 2,
   "vessel": "MSC Jeff",
   "booking_number": "038HOU65",
   "port_of_discharge": "Shanghai Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-07"
  },
  {
   "bl_id": 8,
   "bl_status_id": 3,
   "vessel": "Maerks Jacob",
   "booking_number": "038HOU66",
   "port_of_discharge": "Sines Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-08"
  },
  {
   "bl_id": 9,
   "bl_status_id": 4,
   "vessel": "MSC Vanessa",
   "booking_number": "038HOU67",
   "port_of_discharge": "Izmir Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-09"
  },
  {
   "bl_id": 10,
   "bl_status_id": 5,
   "vessel": "MSC Jeff",
   "booking_number": "038HOU68",
   "port_of_discharge": "Izmir Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-10"
  },
  {
   "bl_id": 11,
   "bl_status_id": 1,
   "vessel": "Maerks Flor",
   "booking_number": "038HOU69",
   "port_of_discharge": "Shanghai Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-11"
  },
  {
   "bl_id": 12,
   "bl_status_id": 2,
   "vessel": "MSC Jeff",
   "booking_number": "038HOU70",
   "port_of_discharge": "Haiphong Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-12"
  },
  {
   "bl_id": 13,
   "bl_status_id": 3,
   "vessel": "Maerks Flor",
   "booking_number": "038HOU71",
   "port_of_discharge": "Shanghai Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-13"
  },
  {
   "bl_id": 14,
   "bl_status_id": 4,
   "vessel": "Maerks Jacob",
   "booking_number": "038HOU72",
   "port_of_discharge": "Sines Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-14"
  },
  {
   "bl_id": 15,
   "bl_status_id": 5,
   "vessel": "MSC Vanessa",
   "booking_number": "038HOU73",
   "port_of_discharge": "Izmir Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-15"
  },
  {
   "bl_id": 16,
   "bl_status_id": 1,
   "vessel": "MSC Jeff",
   "booking_number": "038HOU74",
   "port_of_discharge": "Haiphong Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-16"
  },
  {
   "bl_id": 17,
   "bl_status_id": 2,
   "vessel": "Maerks Flor",
   "booking_number": "038HOU75",
   "port_of_discharge": "Shanghai Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-17"
  },
  {
   "bl_id": 18,
   "bl_status_id": 3,
   "vessel": "Maerks Jacob",
   "booking_number": "038HOU76",
   "port_of_discharge": "Sines Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-18"
  },
  {
   "bl_id": 19,
   "bl_status_id": 4,
   "vessel": "MSC Jeff",
   "booking_number": "038HOU77",
   "port_of_discharge": "Izmir Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-19"
  },
  {
   "bl_id": 20,
   "bl_status_id": 5,
   "vessel": "MSC Vanessa",
   "booking_number": "038HOU78",
   "port_of_discharge": "Shanghai Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-20"
  },
  {
   "bl_id": 21,
   "bl_status_id": 1,
   "vessel": "Maerks Flor",
   "booking_number": "038HOU79",
   "port_of_discharge": "Haiphong Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-21"
  },
  {
   "bl_id": 22,
   "bl_status_id": 2,
   "vessel": "MSC Jeff",
   "booking_number": "038HOU80",
   "port_of_discharge": "Shanghai Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-22"
  },
  {
   "bl_id": 23,
   "bl_status_id": 3,
   "vessel": "Maerks Flor",
   "booking_number": "038HOU81",
   "port_of_discharge": "Sines Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-23"
  },
  {
   "bl_id": 24,
   "bl_status_id": 4,
   "vessel": "MSC Vanessa",
   "booking_number": "038HOU82",
   "port_of_discharge": "Izmir Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-24"
  },
  {
   "bl_id": 25,
   "bl_status_id": 5,
   "vessel": "Maerks Julian",
   "booking_number": "038HOU83",
   "port_of_discharge": "Shanghai Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-25"
  },
  {
   "bl_id": 26,
   "bl_status_id": 1,
   "vessel": "Maerks Flor",
   "booking_number": "038HOU84",
   "port_of_discharge": "Haiphong Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-26"
  },
  {
   "bl_id": 27,
   "bl_status_id": 2,
   "vessel": "Maerks Julian",
   "booking_number": "038HOU85",
   "port_of_discharge": "Shanghai Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-27"
  },
  {
   "bl_id": 28,
   "bl_status_id": 3,
   "vessel": "MSC Jeff",
   "booking_number": "038HOU86",
   "port_of_discharge": "Sines Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-28"
  },
  {
   "bl_id": 29,
   "bl_status_id": 4,
   "vessel": "MSC Vanessa",
   "booking_number": "038HOU87",
   "port_of_discharge": "Izmir Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-29"
  },
  {
   "bl_id": 30,
   "bl_status_id": 5,
   "vessel": "Maerks Flor",
   "booking_number": "038HOU88",
   "port_of_discharge": "Sines Port",
   "port_of_loading": "Houston, TX Port",
   "bl_date": "2020-01-30"
  }
 ],
 "inventory_schedule": [
  {
   "inventory_status_id": 1,
   "product_id": 1,
   "inventory_id": 1
  },
  {
   "inventory_status_id": 2,
   "product_id": 2,
   "inventory_id": 2
  },
  {
   "inventory_status_id": 3,
   "product_id": 3,
   "inventory_id": 3
  },
  {
   "inventory_status_id": 4,
   "product_id": 4,
   "inventory_id": 4
  },
  {
   "inventory_status_id": 1,
   "product_id": 5,
   "inventory_id": 5
  },
  {
   "inventory_status_id": 2,
   "product_id": 1,
   "inventory_id": 6
  },
  {
   "inventory_status_id": 3,
   "product_id": 2,
   "inventory_id": 7
  },
  {
   "inventory_status_id": 4,
   "product_id": 3,
   "inventory_id": 8
  },
  {
   "inventory_status_id": 1,
   "product_id": 1,
   "inventory_id": 9
  },
  {
   "inventory_status_id": 2,
   "product_id": 2,
   "inventory_id": 10
  },
  {
   "inventory_status_id": 3,
   "product_id": 3,
   "inventory_id": 11
  },
  {
   "inventory_status_id": 4,
   "product_id": 4,
   "inventory_id": 12
  },
  {
   "inventory_status_id": 1,
   "product_id": 5,
   "inventory_id": 13
  },
  {
   "inventory_status_id": 2,
   "product_id": 3,
   "inventory_id": 14
  },
  {
   "inventory_status_id": 3,
   "product_id": 1,
   "inventory_id": 15
  },
  {
   "inventory_status_id": 4,
   "product_id": 2,
   "inventory_id": 16
  },
  {
   "inventory_status_id": 1,
   "product_id": 3,
   "inventory_id": 17
  },
  {
   "inventory_status_id": 2,
   "product_id": 4,
   "inventory_id": 18
  },
  {
   "inventory_status_id": 3,
   "product_id": 1,
   "inventory_id": 19
  },
  {
   "inventory_status_id": 4,
   "product_id": 2,
   "inventory_id": 20
  },
  {
   "inventory_status_id": 1,
   "product_id": 3,
   "inventory_id": 21
  },
  {
   "inventory_status_id": 2,
   "product_id": 1,
   "inventory_id": 22
  },
  {
   "inventory_status_id": 3,
   "product_id": 2,
   "inventory_id": 23
  },
  {
   "inventory_status_id": 4,
   "product_id": 1,
   "inventory_id": 24
  },
  {
   "inventory_status_id": 1,
   "product_id": 1,
   "inventory_id": 25
  }
 ],
 "lc": [
  {
   "lc_id": 1,
   "lc_number": "LC1234ABC12",
   "product": "HDPE 2285",
   "unit_measurement_id": 1,
   "quantity": 70.125,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-01",
   "customer": "Oil Varco",
   "cutoff": "2020-01-02",
   "eta": "2020-01-17",
   "ets": "2020-01-07",
   "lc_location": "Haiphong"
  },
  {
   "lc_id": 2,
   "lc_number": "LC1234ABC13",
   "product": "HDPE 950-EF",
   "unit_measurement_id": 1,
   "quantity": 46.75,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-02",
   "customer": "Crude Horizon",
   "cutoff": "2020-01-03",
   "eta": "2020-01-18",
   "ets": "2020-01-08",
   "lc_location": "Sines"
  },
  {
   "lc_id": 3,
   "lc_number": "LC1234ABC14",
   "product": "LLDPE",
   "unit_measurement_id": 1,
   "quantity": 23.375,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-03",
   "customer": "Benzene Pals",
   "cutoff": "2020-01-04",
   "eta": "2020-01-19",
   "ets": "2020-01-09",
   "lc_location": "Shanghia"
  },
  {
   "lc_id": 4,
   "lc_number": "LC1234ABC15",
   "product": "HDPE 2285",
   "unit_measurement_id": 1,
   "quantity": 104,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-04",
   "customer": "Oil Varco",
   "cutoff": "2020-01-05",
   "eta": "2020-01-20",
   "ets": "2020-01-10",
   "lc_location": "Haiphong"
  },
  {
   "lc_id": 5,
   "lc_number": "LC1234ABC16",
   "product": "HDPE 950-EF",
   "unit_measurement_id": 1,
   "quantity": 70.125,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-05",
   "customer": "Crude Horizon",
   "cutoff": "2020-01-06",
   "eta": "2020-01-21",
   "ets": "2020-01-11",
   "lc_location": "Sines"
  },
  {
   "lc_id": 6,
   "lc_number": "LC1234ABC17",
   "product": "LLDPE",
   "unit_measurement_id": 1,
   "quantity": 70.125,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-06",
   "customer": "Benzene Pals",
   "cutoff": "2020-01-07",
   "eta": "2020-01-22",
   "ets": "2020-01-12",
   "lc_location": "Shanghia"
  },
  {
   "lc_id": 7,
   "lc_number": "LC1234ABC18",
   "product": "HDPE 2285",
   "unit_measurement_id": 1,
   "quantity": 46.75,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-07",
   "customer": "Oil Varco",
   "cutoff": "2020-01-08",
   "eta": "2020-01-23",
   "ets": "2020-01-13",
   "lc_location": "Haiphong"
  },
  {
   "lc_id": 8,
   "lc_number": "LC1234ABC19",
   "product": "HDPE 950-EF",
   "unit_measurement_id": 1,
   "quantity": 70.125,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-08",
   "customer": "Crude Horizon",
   "cutoff": "2020-01-09",
   "eta": "2020-01-24",
   "ets": "2020-01-14",
   "lc_location": "Sines"
  },
  {
   "lc_id": 9,
   "lc_number": "LC1234ABC20",
   "product": "LLDPE",
   "unit_measurement_id": 1,
   "quantity": 46.75,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-09",
   "customer": "Benzene Pals",
   "cutoff": "2020-01-10",
   "eta": "2020-01-25",
   "ets": "2020-01-15",
   "lc_location": "Shanghia"
  },
  {
   "lc_id": 10,
   "lc_number": "LC1234ABC21",
   "product": "HDPE 2285",
   "unit_measurement_id": 1,
   "quantity": 23.375,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-10",
   "customer": "Oil Varco",
   "cutoff": "2020-01-11",
   "eta": "2020-01-26",
   "ets": "2020-01-16",
   "lc_location": "Haiphong"
  },
  {
   "lc_id": 11,
   "lc_number": "LC1234ABC22",
   "product": "HDPE 950-EF",
   "unit_measurement_id": 1,
   "quantity": 104,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-11",
   "customer": "Crude Horizon",
   "cutoff": "2020-01-12",
   "eta": "2020-01-27",
   "ets": "2020-01-17",
   "lc_location": "Sines"
  },
  {
   "lc_id": 12,
   "lc_number": "LC1234ABC23",
   "product": "LLDPE",
   "unit_measurement_id": 1,
   "quantity": 46.75,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-12",
   "customer": "Benzene Pals",
   "cutoff": "2020-01-13",
   "eta": "2020-01-28",
   "ets": "2020-01-18",
   "lc_location": "Shanghia"
  },
  {
   "lc_id": 13,
   "lc_number": "LC1234ABC24",
   "product": "HDPE 2285",
   "unit_measurement_id": 1,
   "quantity": 23.375,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-13",
   "customer": "Oil Varco",
   "cutoff": "2020-01-14",
   "eta": "2020-01-29",
   "ets": "2020-01-19",
   "lc_location": "Haiphong"
  },
  {
   "lc_id": 14,
   "lc_number": "LC1234ABC25",
   "product": "HDPE 950-EF",
   "unit_measurement_id": 1,
   "quantity": 104,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-14",
   "customer": "Crude Horizon",
   "cutoff": "2020-01-15",
   "eta": "2020-01-30",
   "ets": "2020-01-20",
   "lc_location": "Sines"
  },
  {
   "lc_id": 15,
   "lc_number": "LC1234ABC26",
   "product": "LLDPE",
   "unit_measurement_id": 1,
   "quantity": 104,
   "lc_price": 50,
   "fee": 0,
   "lc_date": "2020-01-15",
   "customer": "Benzene Pals",
   "cutoff": "2020-01-16",
   "eta": "2020-01-31",
   "ets": "2020-01-21",
   "lc_location": "Shanghia"
  }
 ],
 "link": [
  {
   "link_id": 1,
   "purchase": 25000,
   "sale": 60000,
   "pnl": 35000,
   "gross": 34950,
   "fees": 50,
   "lc_id": 1
  },
  {
   "link_id": 2,
   "purchase": 50000,
   "sale": 70000,
   "pnl": 20000,
   "gross": 19950,
   "fees": 50,
   "lc_id": 2
  },
  {
   "link_id": 3,
   "purchase": 70000,
   "sale": 25000,
   "pnl": -45000,
   "gross": -45050,
   "fees": 50,
   "lc_id": 3
  },
  {
   "link_id": 4,
   "purchase": 60000,
   "sale": 50000,
   "pnl": -10000,
   "gross": -10050,
   "fees": 50,
   "lc_id": 4
  },
  {
   "link_id": 5,
   "purchase": 70000,
   "sale": 70000,
   "pnl": 0,
   "gross": -50,
   "fees": 50,
   "lc_id": 5
  },
  {
   "link_id": 6,
   "purchase": 25000,
   "sale": 60000,
   "pnl": 35000,
   "gross": 34950,
   "fees": 50,
   "lc_id": 6
  },
  {
   "link_id": 7,
   "purchase": 50000,
   "sale": 60000,
   "pnl": 10000,
   "gross": 9950,
   "fees": 50,
   "lc_id": 7
  },
  {
   "link_id": 8,
   "purchase": 70000,
   "sale": 70000,
   "pnl": 0,
   "gross": -50,
   "fees": 50,
   "lc_id": 8
  },
  {
   "link_id": 9,
   "purchase": 60000,
   "sale": 25000,
   "pnl": -35000,
   "gross": -35050,
   "fees": 50,
   "lc_id": 9
  },
  {
   "link_id": 10,
   "purchase": 70000,
   "sale": 50000,
   "pnl": -20000,
   "gross": -20050,
   "fees": 50,
   "lc_id": 10
  },
  {
   "link_id": 11,
   "purchase": 25000,
   "sale": 70000,
   "pnl": 45000,
   "gross": 44950,
   "fees": 50,
   "lc_id": 11
  },
  {
   "link_id": 12,
   "purchase": 50000,
   "sale": 60000,
   "pnl": 10000,
   "gross": 9950,
   "fees": 50,
   "lc_id": 12
  },
  {
   "link_id": 13,
   "purchase": 70000,
   "sale": 70000,
   "pnl": 0,
   "gross": -50,
   "fees": 50,
   "lc_id": 13
  },
  {
   "link_id": 14,
   "purchase": 80000,
   "sale": 25000,
   "pnl": -55000,
   "gross": -55050,
   "fees": 50,
   "lc_id": 14
  },
  {
   "link_id": 15,
   "purchase": 70000,
   "sale": 50000,
   "pnl": -20000,
   "gross": -20050,
   "fees": 50,
   "lc_id": 15
  }
 ]
};
