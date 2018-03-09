/* BinaryToolkit written by Rainer Heynke */

// Used by waveTrack, to read and write binary data from and to WAV format file
const signMasks = [ 0x0, 0x80, 0x8000, 0x800000, 0x80000000 ];
const masks = [ 0x0, 0xFF + 1, 0xFFFF + 1, 0xFFFFFF + 1, 0xFFFFFFFF + 1 ];

export class BinaryReader {
	private data: Uint8Array;
	private pos: number;

	constructor(data) {
		this.data = new Uint8Array(data);
	    this.pos = 0;
	}

    public GotoString(value): void {
        for(var i = this.pos; i < this.data.length; ++i) {
            if (value[0] == String.fromCharCode(this.data[i])) {
                var complete = true;
                for (var j = i; j < value.length + i; ++j) {
                    if (value[j - i] != String.fromCharCode(this.data[j])) {
                        complete = false;
                        break;
                    }
                }

                if (complete == true) {
                    this.pos = i;
                    break;
                }
            }
        }
    }

	public ReadUInt8(bigEndian: boolean = false): number {
        return this.ReadInteger(1, false, bigEndian);
    };

	public ReadInt8(bigEndian: boolean = false): number {
        return this.ReadInteger(1, true, bigEndian);
    };

	public ReadUInt16(bigEndian: boolean = false): number {
        return this.ReadInteger(2, false, bigEndian);
    };

	public ReadInt16(bigEndian: boolean = false): number {
        return this.ReadInteger(2, true, bigEndian);
    };

	public ReadUInt32(bigEndian: boolean = false): number {
        return this.ReadInteger(4, false, bigEndian);
    };

	public ReadInt32(bigEndian: boolean = false): number {
        return this.ReadInteger(4, true, bigEndian);
    };

	public ReadString(size): string {
        var r = "";

        for(var i = 0; i < size; ++i) {
            r += String.fromCharCode(this.data[this.pos++]);
        }
        return r;
    };

    /* size = size in bytes (e.g. 1 = 8 bits, ...)
    * signed = boolean flag to define if the value is signed
    * bigEndian = boolean flag to define the decoding in big endian style
    */
    public ReadInteger(size, signed, bigEndian): number {
        if (this.pos + (size - 1) >= this.data.length) throw "Buffer overflow during reading.";

        var r = 0;

        // read the bytes
        for(var i = 0; i < size; ++i) {
            if (bigEndian === true) {
                r = this.data[this.pos++] + (r << (i * 8));
            } else {
                r += (this.data[this.pos++] << (i * 8));
            }
        }

        // convert from unsigned to signed
        if (signed && r & signMasks[size]) {
            r = r - masks[size];
        }

        return r;
    };

    public EOF() {
        return (this.data.length >= this.pos);
    };
}

export class BinaryWriter {
	public estimatedSize: number;
	public data: Uint8Array;
	public pos: number;

	constructor(estimatedSize) {
	    this.estimatedSize = estimatedSize;
	    this.pos = 0;
	    this.data = new Uint8Array(estimatedSize);
	}

    public WriteUInt8(value, bigEndian: boolean = false): void {
        return this.WriteInteger(value, 1, bigEndian);
    };

    public WriteInt8(value, bigEndian: boolean = false): void {
        return this.WriteInteger(value, 1, bigEndian);
    };

    public WriteUInt16(value, bigEndian: boolean = false): void {
        return this.WriteInteger(value, 2, bigEndian);
    };

    public WriteInt16(value, bigEndian: boolean = false): void {
        return this.WriteInteger(value, 2, bigEndian);
    };

    public WriteUInt32(value, bigEndian: boolean = false): void {
        return this.WriteInteger(value, 4, bigEndian);
    };

    public WriteInt32(value, bigEndian: boolean = false): void {
        return this.WriteInteger(value, 4, bigEndian);
    };

    public WriteString(value): void {
        for(var i = 0; i < value.length; ++i) {
            this.data[this.pos++] = value.charCodeAt(i);
        }
    };

    /* value = the actual value which want to get stored
    * size = size in bytes of the value
    * bigEndian = flag to store the number in big endian style
    */
    public WriteInteger(value, size, bigEndian): void {
        var r = value;

        // convert to unsigned if value is negative
        if (value < 0) {
            r += masks[size];
        }

        // write the bytes
        for(var i = 0; i < size; ++i) {
            if (bigEndian === true) {
                this.data[this.pos++] = (r >> ((size - i - 1) * 8)) & 0xFF;
            } else {
                this.data[this.pos++] = (r >> (i * 8)) & 0xFF;
            }
        }
    };
}
