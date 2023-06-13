 // load dependancies data

 /**
 * Editor configuration data.
 * @return {Object} The config object
 */
const editorConfiguration = {
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
        ]
    },
    link: {
        // Let the users control the "download" attribute of each link.
        decorators: [
            {
                mode: 'manual',
                label: 'Open in new tab',
                attributes: {
                    target: '_blank'
                }
            },
            {
                mode: 'manual',
                label: 'Enable no follow',
                attributes: {
                    rel: 'nofollow'
                }
            }
        ]
    }
};

const bulletConfiguration = {
    //removeButtons: 'Source,Save,NewPage,ExportPdf,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Subscript,Superscript,CopyFormatting,RemoveFormat,NumberedList,Outdent,Indent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Language,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Format,Font,FontSize,TextColor,BGColor,Maximize,ShowBlocks,About',
    toolbar: ['bulletedList', 'numberedList', 'bold', 'italic', 'link', 'undo', 'redo'],
    link: {
        // Let the users control the "download" attribute of each link.
        decorators: [
            {
                mode: 'manual',
                label: 'Open in new tab',
                attributes: {
                    target: '_blank'
                }
            },
            {
                mode: 'manual',
                label: 'Enable no follow',
                attributes: {
                    rel: 'nofollow'
                }
            }
        ]
    }
};

const US_statesList = [
	{
	  "name": "Alaska",
	  "abbreviation": "AK"
	},
	{
	  "name": "Alabama",
	  "abbreviation": "AL"
	},
	{
	  "name": "Arkansas",
	  "abbreviation": "AR"
	},
	{
	  "name": "Arizona",
	  "abbreviation": "AZ"
	},
	{
	  "name": "California",
	  "abbreviation": "CA"
	},
	{
	  "name": "Colorado",
	  "abbreviation": "CO"
	},
	{
	  "name": "Connecticut",
	  "abbreviation": "CT"
	},
	{
	  "name": "Delaware",
	  "abbreviation": "DE"
	},
	{
	  "name": "Florida",
	  "abbreviation": "FL"
	},
	{
	  "name": "Georgia",
	  "abbreviation": "GA"
	},
	{
	  "name": "Hawaii",
	  "abbreviation": "HI"
	},
	{
	  "name": "Iowa",
	  "abbreviation": "IA"
	},
	 
	{
	  "name": "Idaho",
	  "abbreviation": "ID"
	},

	{
	  "name": "Illinois",
	  "abbreviation": "IL"
	},
	{
	  "name": "Indiana",
	  "abbreviation": "IN"
	},
	{
	  "name": "Kansas",
	  "abbreviation": "KS"
	},
	{
	  "name": "Kentucky",
	  "abbreviation": "KY"
	},
	{
	  "name": "Louisiana",
	  "abbreviation": "LA"
	},
	{
	  "name": "Massachusetts",
	  "abbreviation": "MA"
	},
	{
	  "name": "Maryland",
	  "abbreviation": "MD"
	},
	{
	  "name": "Maine",
	  "abbreviation": "ME"
	},

	{
	  "name": "Michigan",
	  "abbreviation": "MI"
	},
	{
	  "name": "Minnesota",
	  "abbreviation": "MN"
	},
	{
	  "name": "Missouri",
	  "abbreviation": "MO"
	},
	{
	  "name": "Mississippi",
	  "abbreviation": "MS"
	},
	{
	  "name": "Montana",
	  "abbreviation": "MT"
	},
	{
	  "name": "North Carolina",
	  "abbreviation": "NC"
	},
	{
	  "name": "North Dakota",
	  "abbreviation": "ND"
	},
	{
	  "name": "Nebraska",
	  "abbreviation": "NE"
	},
	{
	  "name": "New Hampshire",
	  "abbreviation": "NH"
	},
	{
	  "name": "New Jersey",
	  "abbreviation": "NJ"
	},
	{
	  "name": "New Mexico",
	  "abbreviation": "NM"
	},
	{
	  "name": "Nevada",
	  "abbreviation": "NV"
	},
	{
	  "name": "New York",
	  "abbreviation": "NY"
	},
	{
	  "name": "Ohio",
	  "abbreviation": "OH"
	},
	 
	{
	  "name": "Oklahoma",
	  "abbreviation": "OK"
	},
	{
	  "name": "Oregon",
	  "abbreviation": "OR"
	},
	{
	  "name": "Pennsylvania",
	  "abbreviation": "PA"
	},
	{
	  "name": "Rhode Island",
	  "abbreviation": "RI"
	},
	{
	  "name": "South Carolina",
	  "abbreviation": "SC"
	},
	{
	  "name": "South Dakota",
	  "abbreviation": "SD"
	},
	{
	  "name": "Tennessee",
	  "abbreviation": "TN"
	},
	{
	  "name": "Texas",
	  "abbreviation": "TX"
	},

	{
	  "name": "Utah",
	  "abbreviation": "UT"
	},
	 
	{
	  "name": "Virginia",
	  "abbreviation": "VA"
	},
	{
	  "name": "Vermont",
	  "abbreviation": "VT"
	},
	{
	  "name": "Washington",
	  "abbreviation": "WA"
	},
	{
	  "name": "Wisconsin",
	  "abbreviation": "WI"
	},
	{
	  "name": "West Virginia",
	  "abbreviation": "WV"
	},
	{
	  "name": "Wyoming",
	  "abbreviation": "WY"
	}
];

const NL_statesList = [
	{
	    "name": "Drenthe",
	    "abbreviation": "NLD894"
	},
	{
	    "name": "Friesland",
	    "abbreviation": "NLD895"
	},
	{
        "name": "Gelderland",
        "abbreviation": "NLD896"
	},
	{
        "name": "Groningen",
        "abbreviation": "NLD897"
	},
	{
        "name": "Limburg",
        "abbreviation": "NLD898"
	},
    {
        "name": "Overijssel",
        "abbreviation": "NLD899"
    },
    {
        "name": "Flevoland",
        "abbreviation": "NLD902"
    },
    {
        "name": "Zeeland",
        "abbreviation": "NLD903"
    },
    {
        "name": "Noord-Brabant",
        "abbreviation": "NLD3483"
    },
    {
        "name": "Utrecht",
        "abbreviation": "NLD3484"
    },
    {
        "name": "Zuid-Holland",
        "abbreviation": "NLD3485"
    },
    {
        "name": "Noord-Holland",
        "abbreviation": "NLD3486"
    }
];

export {
    editorConfiguration,
    bulletConfiguration,
    US_statesList,
    NL_statesList,
}